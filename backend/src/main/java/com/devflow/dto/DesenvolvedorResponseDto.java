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
    
    // Data Flattening do Usuário
    private Long usuarioId;
    private String usuarioEmail; 
    
    // Data Flattening do Projeto (pode ser nulo se ele não estiver alocado)
    private Long projetoId; 
    private String projetoNome;
}