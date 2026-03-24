package com.devflow.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.YearMonth;

@Data
public class CustoCloudResponseDto {
    private Long id;
    private String provedor;
    private BigDecimal valorFatura;
    private YearMonth mesReferencia;

    // Data Flattening (Dados do Projeto mastigados)
    private Long projetoId;
    private String projetoNome;
}
