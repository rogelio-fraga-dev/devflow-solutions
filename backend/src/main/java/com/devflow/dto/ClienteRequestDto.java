package com.devflow.dto;

import lombok.Data;

@Data
public class ClienteRequestDto {
    private String razaoSocial;
    private String cnpj;
    private String pessoaContato;
}