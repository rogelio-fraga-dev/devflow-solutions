package com.devflow.dto;

import java.math.BigDecimal;
import lombok.Data;
@Data
public class DesenvolvedorRequestDto {
    private String nome;
    private String senioridade;
    private BigDecimal valorHoraCusto;
    private BigDecimal valorHoraExtra;
    private Long usuarioId;
    private Long projetoId;
}
