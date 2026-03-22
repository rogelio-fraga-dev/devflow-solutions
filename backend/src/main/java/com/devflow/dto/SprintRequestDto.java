package com.devflow.dto;

import java.time.LocalDate;

import com.devflow.model.FaseSprint;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SprintRequestDto {

    @NotNull(message = "O nome da fase é obrigatório")
    private FaseSprint nomeFase;
    
    @NotNull(message = "A data de início é obrigatória")
    private LocalDate dataInicio;
    
    @NotNull(message = "A data de término é obrigatória")
    private LocalDate dataFim;

    @NotNull(message = "O ID do projeto é obrigatório")
    private Long projetoId; 
}
