package com.devflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CustoAdicionalRequestDto {

    @NotBlank(message = "A descrição do custo é obrigatória")
    private String descricao;

    @NotNull(message = "O valor adicional é obrigatório")
    @PositiveOrZero(message = "O valor adicional não pode ser negativo")
    private BigDecimal valorAdicional;

    @NotNull(message = "O ID do projeto é obrigatório")
    private Long projetoId;
}
