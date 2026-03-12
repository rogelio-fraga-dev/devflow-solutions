package com.devflow.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;

@Entity
@Table(name = "tb_endereco")
public class Endereco implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter @Setter
    private Long id;

    @Column(name = "rua")
    @Getter @Setter
    private String rua;

    @Column(name = "bairro")
    @Getter @Setter
    private String bairro;

    @Column(name = "cidade")
    @Getter @Setter
    private String cidade;

    @Column(name = "estado")
    @Getter @Setter
    private String estado;


}