package com.devflow.model;

import com.devflow.exception.BusinessRuleException;
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
     * Budget Guard Patroll (Sentinela Ativo do Ciclo de Vida Financeiro)
     *
     * Intercepta qualquer UPDATE na entidade Projeto ANTES do commit no banco (JPA @PreUpdate).
     * Aplica duas regras financeiras em cascata:
     *
     *  - >= 80% do budget: muta o status para ALERTA (aviso ao front-end)
     *  - >= 100% do budget: lança BusinessRuleException, forçando o Hibernate a
     *    executar ROLLBACK da transação inteira. O lançamento de Timesheet ou
     *    CustoCloud que gerou o estouro é ABORTADO e nenhum dado é persisitido.
     */
    @PreUpdate
    @PrePersist
    public void monitorarBudgetGuard() {
        if (this.budgetTotal == null || this.budgetTotal.compareTo(BigDecimal.ZERO) <= 0
                || this.custoAtualAcumulado == null) {
            return;
        }

        // Projetos fechados não sofrem mais validação do guard
        if (this.status == StatusProjeto.CONCLUIDO || this.status == StatusProjeto.CANCELADO) {
            return;
        }

        BigDecimal percentualGasto = this.custoAtualAcumulado
                .divide(this.budgetTotal, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));

        // NÍVEL CRÍTICO: 100% — Rollback total da transação (Budget Guard ativo)
        if (percentualGasto.compareTo(new BigDecimal("100.00")) >= 0) {
            throw new BusinessRuleException(
                "Operação bloqueada pelo Budget Guard: o projeto '" + this.nome +
                "' atingiu " + percentualGasto.setScale(1, RoundingMode.HALF_UP) +
                "% do orçamento aprovado (R$ " + this.budgetTotal + "). " +
                "Nenhum novo custo pode ser registrado."
            );
        }

        // NÍVEL DE RISCO: 80% — Alerta mas permite continuar
        if (percentualGasto.compareTo(new BigDecimal("80.00")) >= 0) {
            this.status = StatusProjeto.ALERTA;
        }
    }
}