package com.devflow.dto;

import java.time.LocalDate;
import com.devflow.model.FaseSprint;
import com.devflow.model.SprintStatus;
import lombok.Data;
@Data
public class SprintResponseDto {

    private Long id;
    private FaseSprint nomeFase;
    private SprintStatus status;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    
    // Data Flattening (Achatamento)
    private Long projetoId;
    private String projetoNome;
}  
