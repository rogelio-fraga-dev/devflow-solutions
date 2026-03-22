package com.devflow.dto;

import java.math.BigDecimal;

import com.devflow.model.Senioridade;

import lombok.Data;
@Data
public class DesenvolvedorResponseDto {
    private Long id;
    private String nome;
    private Senioridade senioridade;
    private BigDecimal valorHoraCusto;
    private BigDecimal valorHoraExtra;
    private Long usuarioId;
    private Long projetoId; 
}