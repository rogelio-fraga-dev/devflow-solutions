package com.devflow.service;

import com.devflow.dto.ProjetoRequestDto;
import com.devflow.dto.ProjetoResponseDto;
import java.util.List;

public interface ProjetoService {
    ProjetoResponseDto criarProjeto(ProjetoRequestDto request);
    List<ProjetoResponseDto> listarProjetos();
    ProjetoResponseDto buscarProjeto(Long id);
    ProjetoResponseDto atualizarProjeto(Long id, ProjetoRequestDto request);
    void deletarProjeto(Long id);
    
}
