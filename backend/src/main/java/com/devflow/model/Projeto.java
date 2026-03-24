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

    /**
     * Budget Guard Patroll (Sentinela Passivo do Ciclo de Vida)
     * Intercepta qualquer UPDATE/INSERT na entidade Projeto e aplica as regras financeiras:
     *  - >= 80% do budget: muta para ALERTA
     *  - >= 100% do budget: muta para ESTOURADO (bloqueador definitivo)
     */
    @PreUpdate
    @PrePersist
    public void monitorarBudgetGuard() {
        if (this.budgetTotal == null || this.budgetTotal.compareTo(BigDecimal.ZERO) <= 0
                || this.custoAtualAcumulado == null) {
            return;
        }

        // Projetos fechados não sofrem mais mutação de status pelo guard
        if (this.status == StatusProjeto.CONCLUIDO || this.status == StatusProjeto.CANCELADO) {
            return;
        }

        BigDecimal percentualGasto = this.custoAtualAcumulado
                .divide(this.budgetTotal, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));

        // Nível Crítico: 100% - Budget ESTOURADO (bloqueia novos custos no front)
        if (percentualGasto.compareTo(new BigDecimal("100.00")) >= 0) {
            this.status = StatusProjeto.ESTOURADO;
        }
        // Nível de Risco: 80% - Budget em ALERTA
        else if (percentualGasto.compareTo(new BigDecimal("80.00")) >= 0) {
            this.status = StatusProjeto.ALERTA;
        }
    }
}