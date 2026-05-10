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
@Transactional(readOnly = true)
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
        desenvolvedor.setNome(request.getNome());
        desenvolvedor.setSenioridade(request.getSenioridade());
        desenvolvedor.setValorHoraCusto(request.getValorHoraCusto());
        desenvolvedor.setValorHoraExtra(request.getValorHoraExtra());

        if (request.getUsuarioId() != null) {
            Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com ID: " + request.getUsuarioId()));
            desenvolvedor.setUsuario(usuario);
        }

        if (request.getProjetoId() != null) {
            Projeto projeto = projetoRepository.findById(request.getProjetoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + request.getProjetoId()));
            desenvolvedor.setProjeto(projeto);
        }

        return mapEntityToResponse(desenvolvedorRepository.save(desenvolvedor));
    }

    @Override
    @Transactional
    public DesenvolvedorResponseDto atualizarDesenvolvedor(Long id, DesenvolvedorRequestDto request) {
        Desenvolvedor desenvolvedor = desenvolvedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Desenvolvedor não encontrado com ID: " + id));

        desenvolvedor.setNome(request.getNome());
        desenvolvedor.setSenioridade(request.getSenioridade());
        desenvolvedor.setValorHoraCusto(request.getValorHoraCusto());
        desenvolvedor.setValorHoraExtra(request.getValorHoraExtra());

        if (request.getUsuarioId() != null) {
            Long usuarioAtualId = desenvolvedor.getUsuario() != null ? desenvolvedor.getUsuario().getId() : null;
            if (!request.getUsuarioId().equals(usuarioAtualId)) {
                Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                        .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
                desenvolvedor.setUsuario(usuario);
            }
        }

        if (request.getProjetoId() != null) {
            Long projetoAtualId = desenvolvedor.getProjeto() != null ? desenvolvedor.getProjeto().getId() : null;
            if (!request.getProjetoId().equals(projetoAtualId)) {
                Projeto projeto = projetoRepository.findById(request.getProjetoId())
                        .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado"));
                desenvolvedor.setProjeto(projeto);
            }
        } else {
            desenvolvedor.setProjeto(null);
        }

        return mapEntityToResponse(desenvolvedorRepository.save(desenvolvedor));
    }

    @Override
    public DesenvolvedorResponseDto buscarDesenvolvedor(Long id) {
        return mapEntityToResponse(desenvolvedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Desenvolvedor não encontrado")));
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
        desenvolvedorRepository.delete(desenvolvedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Desenvolvedor não encontrado")));
    }

    private DesenvolvedorResponseDto mapEntityToResponse(Desenvolvedor desenvolvedor) {
        DesenvolvedorResponseDto response = new DesenvolvedorResponseDto();
        response.setId(desenvolvedor.getId());
        response.setNome(desenvolvedor.getNome());
        response.setSenioridade(desenvolvedor.getSenioridade());
        response.setValorHoraCusto(desenvolvedor.getValorHoraCusto());
        response.setValorHoraExtra(desenvolvedor.getValorHoraExtra());

        if (desenvolvedor.getUsuario() != null) {
            response.setUsuarioId(desenvolvedor.getUsuario().getId());
            response.setUsuarioEmail(desenvolvedor.getUsuario().getEmail());
        }

        if (desenvolvedor.getProjeto() != null) {
            response.setProjetoId(desenvolvedor.getProjeto().getId());
            response.setProjetoNome(desenvolvedor.getProjeto().getNome());
        }

        return response;
    }
}
