package com.devflow.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ChangeRequestResponseDto {
    private Long id;
    private String descricaoMudanca;
    private BigDecimal valorAdicional;
    private LocalDate dataAprovacao;

    // Data Flattening (Achatamento de dados do Projeto)
    private Long projetoId;
    private String projetoNome;
}
