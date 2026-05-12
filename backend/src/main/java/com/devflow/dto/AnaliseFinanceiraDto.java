package com.devflow.dto;

import com.devflow.model.StatusProjeto;
import lombok.Data;
import java.math.BigDecimal;

import java.time.LocalDate;

@Data
public class AnaliseFinanceiraDto {
    private Long projetoId;
    private String nomeProjeto;
    private StatusProjeto statusAtual;
    
    private BigDecimal budgetTotal;
    private BigDecimal custoAtual;
    private BigDecimal margemLucroBruta;
    
    // Indicadores Chaves (KPIs)
    private Double burnRatePercentual;
    private Double margemLucroPercentual;
    private Boolean alertaRiscoImediato;

    // Forecast
    private LocalDate dataPrevisaoEsgotamento;
    private Double diasRestantesEstimados;
    private String mensagemForecast;

    // Billable
    private Double totalHorasBillable;
    private Double totalHorasNonBillable;
    private BigDecimal custoNonBillable;
}
