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
}
