package com.devflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CustoApiRequestDto {

    @NotBlank(message = "O nome da ferramenta é obrigatório")
    private String nomeFerramenta;

    @NotNull(message = "O valor da licença é obrigatório")
    @PositiveOrZero(message = "O valor da licença não pode ser negativo")
    private BigDecimal valorLicenca;

    @NotNull(message = "O ID do projeto é obrigatório")
    private Long projetoId;
}
