package com.devflow.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegistroEmpresaRequestDto {

    // --- Dados da Empresa ---

    @NotBlank(message = "O nome fantasia da empresa é obrigatório")
    private String nomeFantasia;

    @NotBlank(message = "O CNPJ da empresa é obrigatório")
    private String cnpj;

    // --- Dados do Administrador (Primeiro usuário) ---

    @NotBlank(message = "O nome do administrador é obrigatório")
    private String nomeAdmin;

    @NotBlank(message = "O e-mail do administrador é obrigatório")
    @Email(message = "Formato de e-mail inválido")
    private String emailAdmin;

    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres")
    private String senhaAdmin;
}
