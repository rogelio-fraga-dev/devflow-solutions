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
    private String descricao;
    private com.devflow.model.PrioridadeProjeto prioridade;
    private com.devflow.model.RiscoProjeto riscoAtual;
    private BigDecimal budgetTotal;
    private BigDecimal custoAtualAcumulado;
    private LocalDate dataInicio;
    private LocalDate dataPrevisaoEntrega;
    private StatusProjeto status;

    private Long clienteId;
    private String clienteNome;
    
    private Long gestorId;
    private String gestorNome;
    
    private java.util.List<DesenvolvedorResponseDto> desenvolvedores = new java.util.ArrayList<>();
}
