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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Senioridade senioridade;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorHoraCusto;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorHoraExtra;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "projeto_id")
    private Projeto projeto;
}