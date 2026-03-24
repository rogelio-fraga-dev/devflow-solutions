package com.devflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;
import java.time.YearMonth;

@Data
public class CustoCloudRequestDto {

    @NotBlank(message = "O provedor da nuvem (ex: AWS, Azure) é obrigatório")
    private String provedor;

    @NotNull(message = "O valor da fatura é obrigatório")
    @PositiveOrZero(message = "O valor da fatura não pode ser negativo")
    private BigDecimal valorFatura;

    @NotNull(message = "O mês de referência é obrigatório (Formato: YYYY-MM)")
    private YearMonth mesReferencia;

    @NotNull(message = "O ID do projeto é obrigatório")
    private Long projetoId;
}
