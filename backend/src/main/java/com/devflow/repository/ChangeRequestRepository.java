package com.devflow.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.devflow.model.ChangeRequest;
import com.devflow.model.Projeto;

public interface ChangeRequestRepository extends JpaRepository<ChangeRequest, Long> {
    List<ChangeRequest> findByDescricaoMudanca(
        String descricaoMudanca
    );
    List<ChangeRequest> findByProjeto(
        Projeto projeto
    );
    
}
