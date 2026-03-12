package com.devflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devflow.model.Cliente;
import com.devflow.model.Projeto;
import java.util.List;
import java.util.Optional;  

public interface ProjetoRepository extends JpaRepository<Projeto, Long> {
    List<Projeto> findByStatus (
        String status
    );
    List<Projeto> findByClienteContainingIgnoreCase (
        Cliente cliente
    );
    List<Projeto> findByNomeContainingIgnoreCase (
        String nome
    );
    Optional<Projeto> findById(
        Long id
    );
}
