package com.devflow.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class ProjetoResumoDto {
    private Long id;
    private String nome;
    private String clienteNome;
    private BigDecimal budgetTotal;
    private BigDecimal custoAtual;
    private double burnRatePercentual;
    private String status;
}
