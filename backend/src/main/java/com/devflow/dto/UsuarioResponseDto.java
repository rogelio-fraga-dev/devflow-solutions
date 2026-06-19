package com.devflow.dto;

import lombok.Data;
import com.devflow.model.Role;

@Data
public class UsuarioResponseDto {
    private Long id;
    private String nome;
    private String email;
    private Role role;
    private Boolean ativo;
    private String foto;
}

