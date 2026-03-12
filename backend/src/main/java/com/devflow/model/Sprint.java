package com.devflow.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "tb_sprint")
public class Sprint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "nome_Fase",nullable = false)
    @Getter @Setter
    private FaseSprint nomeFase;

    @ManyToOne
    @JoinColumn(name = "projeto_id", nullable = false)
    @Getter @Setter
    private Projeto projeto;
    
    @ManyToOne
    @JoinColumn(name = "status", nullable = false)
    @Getter @Setter
    private SprintStatus status;
    
    @Column(name = "data_inicio", nullable = false)
    @Getter @Setter
    private LocalDate dataInicio;

    @Column(name = "data_fim", nullable = false)
    @Getter @Setter
    private LocalDate dataFim;

}