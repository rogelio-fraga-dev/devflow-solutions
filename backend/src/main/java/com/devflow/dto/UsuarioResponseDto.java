package com.devflow.dto;

import lombok.Data;

@Data
public class UsuarioResponseDto {
    private Long id;
    private String email;
    private String role;
}
