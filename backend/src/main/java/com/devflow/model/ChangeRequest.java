package com.devflow.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.FetchType;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tb_change_request")
@Getter
@Setter
public class ChangeRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "descricao_mudanca", nullable = false)
    private String descricaoMudanca;
    
    @Column(name = "valor_adicional", nullable = false)
    private BigDecimal valorAdicional;

    @Column(name = "data_aprovacao", nullable = true)
    private LocalDate dataAprovacao;

    @Enumerated(EnumType.STRING)
    private StatusChangeRequest status;

    @Column(name = "impacto_horas")
    private Integer impactoHoras;

    private String solicitante;

    @Column(columnDefinition = "TEXT")
    private String justificativa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projeto_id", nullable = false)
    private Projeto projeto;
    
}
