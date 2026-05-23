package com.devflow.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CustoAdicionalResponseDto {
    private Long id;
    private String descricao;
    private BigDecimal valorAdicional;

    // Data Flattening (Dados do Projeto mastigados)
    private Long projetoId;
    private String projetoNome;
}
