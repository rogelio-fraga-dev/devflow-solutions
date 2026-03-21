package com.devflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ClienteRequestDto {

    @NotBlank(message = "A razão social é obrigatória")
    @Size(min = 3, max = 150, message = "A razão social deve ter entre 3 e 150 caracteres")
    private String razaoSocial;

    @NotBlank(message = "O CNPJ é obrigatório")
    @Pattern(regexp = "\\d{14}", message = "O CNPJ deve conter exatamente 14 dígitos numéricos")
    private String cnpj;

    @NotBlank(message = "O contato é obrigatório")
    private String pessoaContato;

    // Getters e Setters (Omitidos para brevidade, mas devem existir)
    public String getRazaoSocial() { return razaoSocial; }
    public void setRazaoSocial(String razaoSocial) { this.razaoSocial = razaoSocial; }

    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }

    public String getPessoaContato() { return pessoaContato; }
    public void setPessoaContato(String pessoaContato) { this.pessoaContato = pessoaContato; }
}