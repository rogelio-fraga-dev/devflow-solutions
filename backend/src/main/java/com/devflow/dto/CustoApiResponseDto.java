package com.devflow.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CustoApiResponseDto {
    private Long id;
    private String nomeFerramenta;
    private BigDecimal valorLicenca;

    // Data Flattening (Dados do Projeto mastigados)
    private Long projetoId;
    private String projetoNome;
}
