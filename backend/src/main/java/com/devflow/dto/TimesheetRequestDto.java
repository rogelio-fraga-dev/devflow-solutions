package com.devflow.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TimesheetRequestDto {
    
    @NotNull(message = "Data de Registro Obrigatorio")
    @PastOrPresent(message = "A data de registro deve ser uma data passada ou atual")
    private LocalDate dataRegistro;

    @NotNull(message = "O ID do desenvolvedor é obrigatório")
    private Long desenvolvedorId;
    
    @NotNull(message = "O ID da sprint é obrigatório")
    private Long sprintId;

    private String descricaoTarefa;
    
    @NotNull(message = "O número de horas trabalhadas é obrigatório")
    @Positive(message = "O número de horas trabalhadas deve ser um valor positivo")
    private Double horasTrabalhadas;
    
    private Double horasExtras;
}