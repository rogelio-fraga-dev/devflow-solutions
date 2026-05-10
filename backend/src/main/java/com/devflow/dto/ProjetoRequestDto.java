package com.devflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;

@Data
public class ProjetoRequestDto {
    @NotBlank(message = "O nome é obrigatório")
    private String nome;
    
    private String stackTecnologica;

    @NotNull(message = "O budget total é obrigatório")
    @Positive(message = "O budget total deve um valor positivo")
    private BigDecimal budgetTotal;

    @NotNull(message = "A data de início é obrigatória")
    private LocalDate dataInicio;

    private LocalDate dataPrevisaoEntrega;
    
    // Cliente é opcional — pode criar projeto sem cliente vinculado
    private Long clienteId;

}
