package com.devflow.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import com.devflow.model.Role;

@Data
public class UsuarioRequestDto {
    
    @NotBlank(message = "O email é obrigatório")
    @Email(message = "Formato de e-mail inválido")
    private String email;

    @NotBlank(message = "A senha é obrigatória")
    private String senha;
    
    @NotNull(message = "A classificação de usuário é obrigatória (Dev ou Admin)")
    private Role role;

}
