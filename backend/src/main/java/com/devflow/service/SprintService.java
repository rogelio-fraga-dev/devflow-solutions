package com.devflow.service;

import com.devflow.dto.SprintRequestDto;
import com.devflow.dto.SprintResponseDto;
import java.util.List;

public interface SprintService {
    SprintResponseDto criarSprint(SprintRequestDto request);
    List<SprintResponseDto> listarSprintsPorProjeto(Long projetoId); // Busca específica!
    SprintResponseDto buscarSprint(Long id);
    SprintResponseDto atualizarSprint(Long id, SprintRequestDto request);
    void deletarSprint(Long id);
}
