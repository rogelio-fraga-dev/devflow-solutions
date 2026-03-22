package com.devflow.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "tb_cliente")
@Getter
@Setter
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String razaoSocial;

    @Column(nullable = false, unique = true)
    private String cnpj;

    private String pessoaContato;

    @Embedded
    private Endereco endereco;
}