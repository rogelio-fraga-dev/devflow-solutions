package com.devflow.model;

import java.math.BigDecimal;
import java.time.YearMonth;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "tb_custo_cloud")
@Data
public class CustoCloud {
    @Id
    @GeneratedValue(strategy = 
        GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String provedor;

    @Column(nullable = false)
    private BigDecimal valorFatura;

    @Column(nullable = false)
    private YearMonth mesReferencia;

    @ManyToOne
    @JoinColumn(name = "projeto_id", nullable = false)
    private Projeto projeto;
}