package com.devflow.dto;

import java.math.BigDecimal;
import java.util.List;
import lombok.Data;

@Data
public class DashboardExecutivoDto {
    private int totalProjetos;
    private int projetosEmAlerta;
    private int projetosEstourados;
    private int projetosEmAndamento;
    private BigDecimal investimentoTotalAlocado;
    private BigDecimal custoTotalAcumulado;
    private BigDecimal margemGlobal;
    private double burnRateGlobal;
    private List<ProjetoResumoDto> resumoProjetos;
}
