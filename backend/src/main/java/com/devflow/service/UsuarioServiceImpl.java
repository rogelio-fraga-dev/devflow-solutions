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

        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        usuario.setRole(request.getRole());

        usuario = usuarioRepository.save(usuario);

        return converterParaDto(usuario);
    }

    @Override
    public List<UsuarioResponseDto> listarUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::converterParaDto)
                .collect(Collectors.toList());
    }

    @Override
    public UsuarioResponseDto buscarUsuario(Long id) {
        Usuario usuario = buscarPorId(id);
        return converterParaDto(usuario);
    }

    @Override
    @Transactional
    public UsuarioResponseDto atualizarUsuario(Long id, UsuarioRequestDto request) {
        Usuario usuario = buscarPorId(id);

        // Regra de Negócio: Verificar se o novo email já existe e se NÃO pertence ao próprio usuário que estamos editando
        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmailIgnoreCase(request.getEmail());
        if (usuarioExistente.isPresent() && !usuarioExistente.get().getId().equals(id)) {
            throw new IllegalArgumentException("Este e-mail já está em uso por outro usuário!");
        }

        usuario.setEmail(request.getEmail());
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        usuario.setRole(request.getRole());

        usuario = usuarioRepository.save(usuario);

        return converterParaDto(usuario);
    }

    @Override
    @Transactional
    public void deletarUsuario(Long id) {
        Usuario usuario = buscarPorId(id);
        usuarioRepository.delete(usuario);
    }

    // MÉTODOS AUXILIARES (Deixam o código mais limpo e evitam repetição)

    private Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com ID: " + id));
    }

    private UsuarioResponseDto converterParaDto(Usuario usuario) {
        UsuarioResponseDto response = new UsuarioResponseDto();
        response.setId(usuario.getId());
        response.setEmail(usuario.getEmail());
        response.setRole(usuario.getRole());
        // A senha NUNCA é colocada aqui.
        return response;
    }
}
