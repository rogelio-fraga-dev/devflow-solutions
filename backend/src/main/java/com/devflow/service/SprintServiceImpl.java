package com.devflow.service;

import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

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
public class SprintServiceImpl implements SprintService {

    private final SprintRepository sprintRepository;
    private final ProjetoRepository projetoRepository;

    public SprintServiceImpl(SprintRepository sprintRepository, ProjetoRepository projetoRepository) {
        this.sprintRepository = sprintRepository;
        this.projetoRepository = projetoRepository;
    }

    @Override
    @Transactional
    public SprintResponseDto criarSprint(SprintRequestDto request) {
        Projeto projeto = projetoRepository.findById(request.getProjetoId())
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + request.getProjetoId()));

        if (projeto.getStatus() == StatusProjeto.CONCLUIDO || projeto.getStatus() == StatusProjeto.CANCELADO) {
            throw new BusinessRuleException("Não é possível adicionar uma Sprint a um projeto encerrado ou cancelado.");
        }

        Sprint sprint = new Sprint();
        sprint.setNomeFase(request.getNomeFase());
        sprint.setDataInicio(request.getDataInicio());
        sprint.setDataFim(request.getDataFim());
        sprint.setProjeto(projeto);
        sprint.setStatus(SprintStatus.PLANEJADA);

        sprint = sprintRepository.save(sprint);

        return mapToResponse(sprint);
    } 

    @Override
    public List<SprintResponseDto> listarSprintsPorProjeto(Long projetoId) {
        return sprintRepository.findByProjetoId(projetoId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public SprintResponseDto buscarSprint(Long id) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint não encontrada com ID: " + id));
        return mapToResponse(sprint);
    }

    @Override
    @Transactional
    public SprintResponseDto atualizarSprint(Long id, SprintRequestDto request) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint não encontrada com ID: " + id));

        // Regra do Merge: Se mudou o projeto, valida de novo!
        if (!sprint.getProjeto().getId().equals(request.getProjetoId())) {
            Projeto novoProjeto = projetoRepository.findById(request.getProjetoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Novo Projeto não encontrado com ID: " + request.getProjetoId()));
            
            if (novoProjeto.getStatus() == StatusProjeto.CONCLUIDO || novoProjeto.getStatus() == StatusProjeto.CANCELADO) {
                throw new BusinessRuleException("Não é possível mover a Sprint para um projeto encerrado ou cancelado.");
            }
            sprint.setProjeto(novoProjeto);
        }

        sprint.setNomeFase(request.getNomeFase());
        sprint.setDataInicio(request.getDataInicio());
        sprint.setDataFim(request.getDataFim());

        sprint = sprintRepository.save(sprint);
        return mapToResponse(sprint);
    }

    @Override
    @Transactional
    public void deletarSprint(Long id) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint não encontrada com ID: " + id));
        sprintRepository.delete(sprint);
    }
    private SprintResponseDto mapToResponse(Sprint sprint) {
        SprintResponseDto response = new SprintResponseDto();
        response.setId(sprint.getId());
        response.setNomeFase(sprint.getNomeFase());
        response.setDataInicio(sprint.getDataInicio());
        response.setDataFim(sprint.getDataFim());
        response.setStatus(sprint.getStatus());
        
        // Data Flattening
        response.setProjetoId(sprint.getProjeto().getId());
        response.setProjetoNome(sprint.getProjeto().getNome()); 
        
        return response;
    } 
}