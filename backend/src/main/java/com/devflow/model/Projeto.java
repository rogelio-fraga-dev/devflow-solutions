package com.devflow.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

@Entity
@Table(name = "tb_projeto")
@Getter
@Setter
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

    @Enumerated(EnumType.STRING)
    private StatusProjeto status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    // Budget Guard (Sentinela Passivo do Custo Vivo)
    @PreUpdate
    @PrePersist
    public void monitorarBudgetGuard() {
        if (this.budgetTotal != null && this.budgetTotal.compareTo(BigDecimal.ZERO) > 0 
            && this.custoAtualAcumulado != null) {
            
            BigDecimal tetoAlerta = this.budgetTotal.multiply(new BigDecimal("0.80"));
            
            // Se Custo Atual >= 80% do Budget, entra em estado de Risco/Alerta
            if (this.custoAtualAcumulado.compareTo(tetoAlerta) >= 0) {
                if (this.status != StatusProjeto.CONCLUIDO && this.status != StatusProjeto.CANCELADO) {
                    this.status = StatusProjeto.ALERTA;
                }
            }
        }
    }
}