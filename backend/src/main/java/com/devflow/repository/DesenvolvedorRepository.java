package com.devflow.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.devflow.model.Desenvolvedor;
import com.devflow.model.Usuario;

public interface DesenvolvedorRepository extends JpaRepository<Desenvolvedor, Long> {
    List<Desenvolvedor> findByNomeContainingIgnoreCase (
        String nome
    );
    List<Desenvolvedor> findBySenioridade (
        String senioridade
    );
    Optional<Desenvolvedor> findByUsuario (
        Usuario usuario 
    );
    Optional<Desenvolvedor> findByProjeto (
        Long projetoId
    );

    @org.springframework.data.jpa.repository.Query("""
        SELECT d.id, d.nome, d.senioridade,
               COALESCE(SUM(t.horasTrabalhadas), 0)       AS totalHoras,
               COALESCE(SUM(t.horasExtras), 0)             AS totalExtras,
               COALESCE(SUM(t.horasTrabalhadas * d.valorHoraCusto +
                            COALESCE(t.horasExtras,0) * d.valorHoraExtra), 0) AS custoGerado,
               COUNT(DISTINCT t.sprint.id)                 AS totalSprints
        FROM Desenvolvedor d
        LEFT JOIN Timesheet t ON t.desenvolvedor.id = d.id
        LEFT JOIN Projeto p ON d.projeto.id = p.id
        WHERE d.usuario.empresa.id = :empresaId
        GROUP BY d.id, d.nome, d.senioridade
        ORDER BY custoGerado DESC
    """)
    List<Object[]> findProdutividadeRankingByEmpresaId(@org.springframework.data.repository.query.Param("empresaId") Long empresaId);
}
