package com.devflow.dto;

import com.devflow.model.StatusProjeto;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;

@Data
public class ProjetoResponseDto {

    private Long id;
    private String nome;
    private String stackTecnologica;
    private BigDecimal budgetTotal;
    private BigDecimal custoAtualAcumulado;
    private LocalDate dataInicio;
    private LocalDate dataPrevisaoEntrega;
    private StatusProjeto status;

    private Long clienteId;
    private String clienteNome;
    
}
