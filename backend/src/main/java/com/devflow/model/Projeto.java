package com.devflow.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "tb_projeto")
public class Projeto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String stackTecnologica;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal budgetTotal;

    @Column(precision = 15, scale = 2)
    private BigDecimal custoAtualAcumulado = BigDecimal.ZERO;

    @Column(nullable = false)
    private LocalDate dataInicio;

    private LocalDate dataPrevisaoEntrega;

    private String status; // ATIVO, ALERTA, FECHADO

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;
}