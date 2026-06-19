package com.devflow.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.Objects;

@Getter
@Setter
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
    @JoinColumn(name = "usuario_id", unique = true)
    private Usuario usuario;

    @ManyToMany(mappedBy = "desenvolvedores")
    private java.util.List<Projeto> projetos = new java.util.ArrayList<>();

    // equals/hashCode baseados apenas no id (chave substituta).
    // Evita travessia da coleção lazy 'projetos' e LazyInitializationException.
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Desenvolvedor that)) return false;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}