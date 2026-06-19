package com.devflow.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devflow.dto.SprintRequestDto;
import com.devflow.dto.SprintResponseDto;
import com.devflow.exception.BusinessRuleException;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.model.Projeto;
import com.devflow.model.Sprint;
import com.devflow.model.SprintStatus;
import com.devflow.model.StatusProjeto;
import com.devflow.repository.ProjetoRepository;
import com.devflow.repository.SprintRepository;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class SprintServiceImpl implements SprintService {

    private final SprintRepository sprintRepository;
    private final ProjetoRepository projetoRepository;
    private final com.devflow.repository.UsuarioRepository usuarioRepository;

    public SprintServiceImpl(SprintRepository sprintRepository, ProjetoRepository projetoRepository,
                             com.devflow.repository.UsuarioRepository usuarioRepository) {
        this.sprintRepository = sprintRepository;
        this.projetoRepository = projetoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    private Long getEmpresaLogadaId() {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário logado não encontrado"))
                .getEmpresa().getId();
    }

    // Isolamento multi-tenant via projeto da sprint.
    private void assertProjetoDaEmpresa(Projeto projeto) {
        if (projeto.getEmpresa() == null || !projeto.getEmpresa().getId().equals(getEmpresaLogadaId())) {
            throw new ResourceNotFoundException("Projeto não encontrado com ID: " + projeto.getId());
        }
    }

    private void assertMesmaEmpresa(Sprint sprint) {
        assertProjetoDaEmpresa(sprint.getProjeto());
    }

    @Override
    @Transactional
    public SprintResponseDto criarSprint(SprintRequestDto request) {
        Projeto projeto = projetoRepository.findById(request.getProjetoId())
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + request.getProjetoId()));
        assertProjetoDaEmpresa(projeto);

        if (projeto.getStatus() == StatusProjeto.CONCLUIDO || projeto.getStatus() == StatusProjeto.CANCELADO) {
            throw new BusinessRuleException("Não é possível adicionar uma Sprint a um projeto encerrado ou cancelado.");
        }

        Sprint sprint = new Sprint();
        sprint.setNomeFase(request.getNomeFase());
        sprint.setDataInicio(request.getDataInicio());
        sprint.setDataFim(request.getDataFim());
        sprint.setObjetivo(request.getObjetivo());
        sprint.setObservacoes(request.getObservacoes());
        sprint.setHorasEstimadas(request.getHorasEstimadas());
        sprint.setProjeto(projeto);
        sprint.setStatus(request.getStatus() != null ? request.getStatus() : SprintStatus.PLANEJADA);

        return mapToResponse(sprintRepository.save(sprint));
    }

    @Override
    public List<SprintResponseDto> listarSprintsPorProjeto(Long projetoId) {
        Projeto projeto = projetoRepository.findById(projetoId)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + projetoId));
        assertProjetoDaEmpresa(projeto);
        return sprintRepository.findByProjetoId(projetoId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public SprintResponseDto buscarSprint(Long id) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint não encontrada com ID: " + id));
        assertMesmaEmpresa(sprint);
        return mapToResponse(sprint);
    }

    @Override
    @Transactional
    public SprintResponseDto atualizarSprint(Long id, SprintRequestDto request) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint não encontrada com ID: " + id));
        assertMesmaEmpresa(sprint);

        if (!sprint.getProjeto().getId().equals(request.getProjetoId())) {
            Projeto novoProjeto = projetoRepository.findById(request.getProjetoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Novo Projeto não encontrado com ID: " + request.getProjetoId()));
            assertProjetoDaEmpresa(novoProjeto);

            if (novoProjeto.getStatus() == StatusProjeto.CONCLUIDO || novoProjeto.getStatus() == StatusProjeto.CANCELADO) {
                throw new BusinessRuleException("Não é possível mover a Sprint para um projeto encerrado ou cancelado.");
            }
            sprint.setProjeto(novoProjeto);
        }

        sprint.setNomeFase(request.getNomeFase());
        sprint.setDataInicio(request.getDataInicio());
        sprint.setDataFim(request.getDataFim());
        sprint.setObjetivo(request.getObjetivo());
        sprint.setObservacoes(request.getObservacoes());
        sprint.setHorasEstimadas(request.getHorasEstimadas());

        if (request.getStatus() != null) {
            sprint.setStatus(request.getStatus());
        }

        return mapToResponse(sprintRepository.save(sprint));
    }

    @Override
    @Transactional
    public void deletarSprint(Long id) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint não encontrada com ID: " + id));
        assertMesmaEmpresa(sprint);
        sprintRepository.delete(sprint);
    }

    private SprintResponseDto mapToResponse(Sprint sprint) {
        SprintResponseDto response = new SprintResponseDto();
        response.setId(sprint.getId());
        response.setNomeFase(sprint.getNomeFase());
        response.setDataInicio(sprint.getDataInicio());
        response.setDataFim(sprint.getDataFim());
        response.setObjetivo(sprint.getObjetivo());
        response.setObservacoes(sprint.getObservacoes());
        response.setHorasEstimadas(sprint.getHorasEstimadas());
        response.setStatus(sprint.getStatus());
        response.setProjetoId(sprint.getProjeto().getId());
        response.setProjetoNome(sprint.getProjeto().getNome());
        return response;
    }
}
