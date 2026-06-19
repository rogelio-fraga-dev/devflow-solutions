package com.devflow.service;

import com.devflow.dto.UsuarioRequestDto;
import com.devflow.dto.UsuarioResponseDto;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.model.Usuario;
import com.devflow.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public UsuarioResponseDto criarUsuario(UsuarioRequestDto request) {
        // Regra de Negócio: Não permitir emails duplicados
        if (usuarioRepository.findByEmailIgnoreCase(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Este e-mail já está em uso no sistema!");
        }

        Usuario logado = getUsuarioLogado();
        assertPodeAtribuirRole(request.getRole(), logado);

        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        usuario.setRole(request.getRole());
        usuario.setAtivo(request.getAtivo() != null ? request.getAtivo() : Boolean.TRUE);
        usuario.setFoto(request.getFoto());

        // Novo usuário sempre herda a empresa de quem o criou (isolamento multi-tenant)
        usuario.setEmpresa(logado.getEmpresa());

        usuario = usuarioRepository.save(usuario);

        return converterParaDto(usuario);
    }

    @Override
    public List<UsuarioResponseDto> listarUsuarios() {
        Long empresaId = getUsuarioLogado().getEmpresa().getId();
        return usuarioRepository.findByEmpresaId(empresaId).stream()
                .map(this::converterParaDto)
                .collect(Collectors.toList());
    }

    @Override
    public UsuarioResponseDto buscarUsuario(Long id) {
        Usuario usuario = buscarPorId(id);
        assertMesmaEmpresa(usuario);
        return converterParaDto(usuario);
    }

    @Override
    @Transactional
    public UsuarioResponseDto atualizarUsuario(Long id, UsuarioRequestDto request) {
        Usuario usuario = buscarPorId(id);
        assertMesmaEmpresa(usuario);
        assertPodeAtribuirRole(request.getRole(), getUsuarioLogado());

        // Regra de Negócio: Verificar se o novo email já existe e se NÃO pertence ao próprio usuário que estamos editando
        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmailIgnoreCase(request.getEmail());
        if (usuarioExistente.isPresent() && !usuarioExistente.get().getId().equals(id)) {
            throw new IllegalArgumentException("Este e-mail já está em uso por outro usuário!");
        }

        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        usuario.setRole(request.getRole());
        usuario.setAtivo(request.getAtivo() != null ? request.getAtivo() : Boolean.TRUE);
        usuario.setFoto(request.getFoto());


        usuario = usuarioRepository.save(usuario);

        return converterParaDto(usuario);
    }

    @Override
    @Transactional
    public void deletarUsuario(Long id) {
        Usuario usuario = buscarPorId(id);
        assertMesmaEmpresa(usuario);
        usuarioRepository.delete(usuario);
    }

    @Override
    @Transactional
    public void alterarSenha(String email, com.devflow.dto.AlterarSenhaDto dto) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado: " + email));

        if (!passwordEncoder.matches(dto.getSenhaAtual(), usuario.getSenha())) {
            throw new IllegalArgumentException("Senha atual incorreta");
        }

        usuario.setSenha(passwordEncoder.encode(dto.getNovaSenha()));
        usuarioRepository.save(usuario);
    }

    @Override
    public UsuarioResponseDto obterUsuarioLogado(String email) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado: " + email));
        return converterParaDto(usuario);
    }

    @Override
    @Transactional
    public UsuarioResponseDto atualizarFotoUsuarioLogado(String email, String fotoBase64) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado: " + email));
        usuario.setFoto(fotoBase64);
        usuario = usuarioRepository.save(usuario);
        return converterParaDto(usuario);
    }


    // MÉTODOS AUXILIARES (Deixam o código mais limpo e evitam repetição)

    private Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com ID: " + id));
    }

    private Usuario getUsuarioLogado() {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário logado não encontrado"));
    }

    // Isolamento multi-tenant: usuário de outra empresa é tratado como inexistente (404).
    private void assertMesmaEmpresa(Usuario alvo) {
        Long empresaLogada = getUsuarioLogado().getEmpresa().getId();
        if (alvo.getEmpresa() == null || !alvo.getEmpresa().getId().equals(empresaLogada)) {
            throw new ResourceNotFoundException("Usuário não encontrado com ID: " + alvo.getId());
        }
    }

    // Anti-escalonamento: apenas ADMIN pode criar/atribuir o papel ADMIN.
    private void assertPodeAtribuirRole(com.devflow.model.Role roleAlvo, Usuario logado) {
        if (roleAlvo == com.devflow.model.Role.ADMIN && logado.getRole() != com.devflow.model.Role.ADMIN) {
            throw new com.devflow.exception.BusinessRuleException("Apenas administradores podem atribuir o papel ADMIN.");
        }
    }

    private UsuarioResponseDto converterParaDto(Usuario usuario) {
        UsuarioResponseDto response = new UsuarioResponseDto();
        response.setId(usuario.getId());
        response.setNome(usuario.getNome());
        response.setEmail(usuario.getEmail());
        response.setRole(usuario.getRole());
        response.setAtivo(usuario.getAtivo());
        response.setFoto(usuario.getFoto());
        // A senha NUNCA é colocada aqui.
        return response;

    }
}
