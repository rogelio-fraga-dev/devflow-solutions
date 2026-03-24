package com.devflow.service;

import java.util.List;

import com.devflow.dto.ChangeRequestRequestDto;
import com.devflow.dto.ChangeRequestResponseDto;

public interface ChangeRequestService {
    ChangeRequestResponseDto criarChangeRequest(ChangeRequestRequestDto request);
    List<ChangeRequestResponseDto> listarChangeRequests();
    List<ChangeRequestResponseDto> listarPorProjeto(Long projetoId);
    ChangeRequestResponseDto buscarChangeRequest(Long id);
    ChangeRequestResponseDto atualizarChangeRequest(Long id, ChangeRequestRequestDto request);
    void deletarChangeRequest(Long id);
    
}
