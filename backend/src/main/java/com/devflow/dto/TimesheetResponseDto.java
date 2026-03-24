package com.devflow.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class TimesheetResponseDto {
    private Long id;
    private LocalDate dataRegistro;
    private Double horasTrabalhadas;
    private Double horasExtras;
    private String descricaoTarefa;

    //Data Flattening (Achatamento)
    private Long desenvolvedorId;
    private String desenvolvedorNome;
    private Long sprintId;
    private String sprintNome;
}
