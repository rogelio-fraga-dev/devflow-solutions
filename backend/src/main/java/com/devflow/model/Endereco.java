package com.devflow.model;

import jakarta.persistence.*;
import lombok.Data;

@Embeddable
@Data
public class Endereco {
    private String rua;
    private String bairro;
    private String cidade;
    private String estado;
    private String cep;
    private String numero;
}