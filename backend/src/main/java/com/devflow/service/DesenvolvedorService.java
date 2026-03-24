package com.devflow.service;

import com.devflow.dto.DesenvolvedorRequestDto;
import com.devflow.dto.DesenvolvedorResponseDto;
import java.util.List;

public interface DesenvolvedorService {
    DesenvolvedorResponseDto criarDesenvolvedor(DesenvolvedorRequestDto request);
    List<DesenvolvedorResponseDto> listarDesenvolvedores();
    DesenvolvedorResponseDto buscarDesenvolvedor(Long id);
    DesenvolvedorResponseDto atualizarDesenvolvedor(Long id, DesenvolvedorRequestDto request);
    void deletarDesenvolvedor(Long id);
}