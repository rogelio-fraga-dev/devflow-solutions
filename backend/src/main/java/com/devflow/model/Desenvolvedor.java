package com.devflow.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "tb_desenvolvedor")
public class Desenvolvedor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String senioridade; // JUNIOR, PLENO, SENIOR

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorHoraCusto;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}