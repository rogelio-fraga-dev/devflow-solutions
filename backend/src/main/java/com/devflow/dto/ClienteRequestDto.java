package com.devflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import com.devflow.model.Endereco;

@Data
public class ClienteRequestDto {

    @NotBlank(message = "A Razão Social é obrigatória")
    private String razaoSocial;

    private String cnpj;

    private String pessoaContato;

    private Endereco endereco;
}
