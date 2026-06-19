package com.devflow.dto;

import lombok.Data;
import com.devflow.model.Endereco;

@Data
public class ClienteResponseDto {
    private Long id;
    private String razaoSocial;
    private String cnpj;
    private String pessoaContato;
    private Endereco endereco;
    private String foto;
}

