package com.devflow.service;

import com.devflow.dto.CustoApiRequestDto;
import com.devflow.dto.CustoApiResponseDto;
import java.util.List;

public interface CustoApiService {
    CustoApiResponseDto criarCustoApi(CustoApiRequestDto request);
    List<CustoApiResponseDto> listarTodos();
    List<CustoApiResponseDto> listarPorProjeto(Long projetoId);
    CustoApiResponseDto buscarCustoApi(Long id);
    CustoApiResponseDto atualizarCustoApi(Long id, CustoApiRequestDto request);
    void deletarCustoApi(Long id);
}
