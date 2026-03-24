package com.devflow.service;

import com.devflow.dto.CustoCloudRequestDto;
import com.devflow.dto.CustoCloudResponseDto;

import java.util.List;

public interface CustoCloudService {
    CustoCloudResponseDto criarCustoCloud(CustoCloudRequestDto request);
    List<CustoCloudResponseDto> listarTodos();
    List<CustoCloudResponseDto> listarPorProjeto(Long projetoId);
    CustoCloudResponseDto buscarCustoCloud(Long id);
    CustoCloudResponseDto atualizarCustoCloud(Long id, CustoCloudRequestDto request);
    void deletarCustoCloud(Long id);
}
