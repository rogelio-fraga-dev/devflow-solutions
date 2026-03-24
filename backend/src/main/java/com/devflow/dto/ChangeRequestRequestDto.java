package com.devflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ChangeRequestRequestDto {

    @NotBlank(message = "A descrição da mudança é obrigatória")
    private String descricaoMudanca;

    @NotNull(message = "O valor adicional é obrigatório")
    @PositiveOrZero(message = "O valor adicional não pode ser negativo")
    private BigDecimal valorAdicional;

    @NotNull(message = "A data de aprovação é obrigatória")
    private LocalDate dataAprovacao;

    @NotNull(message = "O ID do projeto é obrigatório")
    private Long projetoId;
}
