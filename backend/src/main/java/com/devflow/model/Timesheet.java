package com.devflow.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(
    name = "tb_timesheet",
    indexes = {
        @Index(name = "idx_timesheet_sprint_id", columnList = "sprint_id"),
        @Index(name = "idx_timesheet_desenvolvedor_id", columnList = "desenvolvedor_id")
    }
)
@Getter
@Setter
public class Timesheet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate dataRegistro;

    @Column(nullable = false)
    private Double horasTrabalhadas;

    private Double horasExtras;

    private String descricaoTarefa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "desenvolvedor_id", nullable = false)
    private Desenvolvedor desenvolvedor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sprint_id", nullable = false)
    private Sprint sprint;
}