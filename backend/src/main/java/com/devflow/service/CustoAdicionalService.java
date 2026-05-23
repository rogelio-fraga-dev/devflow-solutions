package com.devflow.service;

import com.devflow.dto.CustoAdicionalRequestDto;
import com.devflow.dto.CustoAdicionalResponseDto;
import java.util.List;

public interface CustoAdicionalService {
    CustoAdicionalResponseDto criarCustoAdicional(CustoAdicionalRequestDto request);
    List<CustoAdicionalResponseDto> listarTodos();
    List<CustoAdicionalResponseDto> listarPorProjeto(Long projetoId);
    CustoAdicionalResponseDto buscarCustoAdicional(Long id);
    CustoAdicionalResponseDto atualizarCustoAdicional(Long id, CustoAdicionalRequestDto request);
    void deletarCustoAdicional(Long id);
}
