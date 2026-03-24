package com.devflow.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.devflow.dto.DesenvolvedorRequestDto;
import com.devflow.dto.DesenvolvedorResponseDto;
import com.devflow.model.Desenvolvedor;
import com.devflow.model.Projeto;
import com.devflow.model.Usuario;
import com.devflow.repository.DesenvolvedorRepository;
import com.devflow.repository.ProjetoRepository;
import com.devflow.repository.UsuarioRepository;
import com.devflow.exception.ResourceNotFoundException;

import java.util.List;

@Service
public class DesenvolvedorServiceImpl implements DesenvolvedorService {

    private final DesenvolvedorRepository desenvolvedorRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProjetoRepository projetoRepository;

    public DesenvolvedorServiceImpl(
            DesenvolvedorRepository desenvolvedorRepository,
            UsuarioRepository usuarioRepository,
            ProjetoRepository projetoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.projetoRepository = projetoRepository;
        this.desenvolvedorRepository = desenvolvedorRepository;
    }

    @Override
    @Transactional
    public DesenvolvedorResponseDto criarDesenvolvedor(DesenvolvedorRequestDto request) {
        Desenvolvedor desenvolvedor = new Desenvolvedor();
        
        // Mapeia dados básicos
        desenvolvedor.setNome(request.getNome());
        desenvolvedor.setSenioridade(request.getSenioridade());
        desenvolvedor.setValorHoraCusto(request.getValorHoraCusto());
        desenvolvedor.setValorHoraExtra(request.getValorHoraExtra());

        // Busca dependências com a Exceção Customizada!
        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com ID: " + request.getUsuarioId()));
        desenvolvedor.setUsuario(usuario);

        if (request.getProjetoId() != null) {
            Projeto projeto = projetoRepository.findById(request.getProjetoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + request.getProjetoId()));
            desenvolvedor.setProjeto(projeto);
        }

        Desenvolvedor savedDesenvolvedor = desenvolvedorRepository.save(desenvolvedor);
        return mapEntityToResponse(savedDesenvolvedor);
    }

    @Override
    @Transactional // Garante que se algo der erro no meio, o banco faz "Rollback"
    public DesenvolvedorResponseDto atualizarDesenvolvedor(Long id, DesenvolvedorRequestDto request) {
        // 1. A REGRA DE OURO: Busca o existente primeiro
        Desenvolvedor desenvolvedor = desenvolvedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Desenvolvedor não encontrado com ID: " + id));

        // 2. Altera campo a campo (preservando o que não foi enviado)
        desenvolvedor.setNome(request.getNome());
        desenvolvedor.setSenioridade(request.getSenioridade());
        desenvolvedor.setValorHoraCusto(request.getValorHoraCusto());
        desenvolvedor.setValorHoraExtra(request.getValorHoraExtra());

        // 3. Verifica mudanças de relacionamentos
        if (!desenvolvedor.getUsuario().getId().equals(request.getUsuarioId())) {
            Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                    .orElseThrow(() -> new ResourceNotFoundException("Novo Usuário não encontrado"));
            desenvolvedor.setUsuario(usuario);
        }

        // 4. Salva o objeto que já está sendo monitorado pelo JPA
        return mapEntityToResponse(desenvolvedorRepository.save(desenvolvedor));
    }

    @Override
    public DesenvolvedorResponseDto buscarDesenvolvedor(Long id) {
        Desenvolvedor desenvolvedor = desenvolvedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Desenvolvedor não encontrado"));
        return mapEntityToResponse(desenvolvedor);
    }

    @Override
    public List<DesenvolvedorResponseDto> listarDesenvolvedores() {
        return desenvolvedorRepository.findAll().stream()
                .map(this::mapEntityToResponse)
                .toList();
    }

    @Override
    @Transactional
    public void deletarDesenvolvedor(Long id) {
        Desenvolvedor desenvolvedor = desenvolvedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Desenvolvedor não encontrado"));
        desenvolvedorRepository.delete(desenvolvedor);
    }

    private DesenvolvedorResponseDto mapEntityToResponse(Desenvolvedor desenvolvedor) {
        DesenvolvedorResponseDto response = new DesenvolvedorResponseDto();
        response.setId(desenvolvedor.getId());
        response.setNome(desenvolvedor.getNome());
        response.setSenioridade(desenvolvedor.getSenioridade());
        response.setValorHoraCusto(desenvolvedor.getValorHoraCusto());
        response.setValorHoraExtra(desenvolvedor.getValorHoraExtra());
        
        // Data Flattening Seguro: Usuário (Garantindo que não vai dar NullPointerException)
        if (desenvolvedor.getUsuario() != null) {
            response.setUsuarioId(desenvolvedor.getUsuario().getId());
            response.setUsuarioEmail(desenvolvedor.getUsuario().getEmail());
        }
        
        // Data Flattening Seguro: Projeto
        if (desenvolvedor.getProjeto() != null) {
            response.setProjetoId(desenvolvedor.getProjeto().getId());
            response.setProjetoNome(desenvolvedor.getProjeto().getNome());
        }
        
        return response;
    }
}