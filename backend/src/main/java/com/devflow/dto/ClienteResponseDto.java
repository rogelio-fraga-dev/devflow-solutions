package com.devflow.dto;

import lombok.Data;

@Data
public class ClienteResponseDto {
    private Long id;
    private String razaoSocial;
    private String cnpj;
    private String pessoaContato;
}