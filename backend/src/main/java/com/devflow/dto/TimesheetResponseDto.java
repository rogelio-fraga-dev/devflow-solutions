package com.devflow.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class TimesheetResponseDto {
    private Long id;
    private LocalDate dataRegistro;
    private Integer horasTrabalhadas;
    private Integer horasExtras;
    private String descricaoTarefa;

    //Data Flattening (Achatamento)
    private Long desenvolvedorId;
    private String desenvolvedorNome;
    private Long sprintId;
    private String sprintNome;
}
