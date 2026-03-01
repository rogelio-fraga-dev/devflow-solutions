package com.devflow.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.devflow.model.Projeto;
import com.devflow.model.Sprint;

public interface SprintRepository extends JpaRepository<Sprint, Long> {
    List<Sprint> findByProjeto (
        Projeto projeto
    );
    List<Sprint> findByProjetoAndStatus (
        Projeto projeto,
        String status
    );
    List<Sprint> findByNomeFaseContainingIgnoreCase (
        String nomeFase
    );
    
}
