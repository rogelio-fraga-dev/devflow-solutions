package com.devflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.br.CNPJ;

@Data
public class ClienteRequestDto {

    @NotBlank(message = "A Razão Social é obrigatória")
    private String razaoSocial;

    @NotBlank(message = "O CNPJ é obrigatório")
    @CNPJ(message = "O CNPJ informado é inválido") // Validação matemática real de CNPJ brasileiro!
    private String cnpj;

    @NotBlank(message = "A pessoa de contato é obrigatória")
    private String pessoaContato;
}