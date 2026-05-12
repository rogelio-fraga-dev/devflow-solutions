package com.devflow.dto;

import java.math.BigDecimal;
import com.devflow.model.Senioridade;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProdutividadeDevDto {
    private Long desenvolvedorId;
    private String nomeDesenvolvedor;
    private String senioridade;
    private double totalHorasLancadas;
    private double totalHorasExtras;
    private BigDecimal custoTotalGerado;
    private long totalSprintsParticipados;
}
