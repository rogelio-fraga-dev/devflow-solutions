package com.devflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.devflow.model.Projeto;
import java.util.List;

public interface ProjetoRepository extends JpaRepository<Projeto, Long> {
    List<Projeto> findByStatus (
        String status
    );
    List<Projeto> findByClienteId (
        Long clienteId
    );
    List<Projeto> findByNomeContainingIgnoreCase (
        String nome
    );
}
