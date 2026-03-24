package com.devflow.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.devflow.model.ChangeRequest;

public interface ChangeRequestRepository extends JpaRepository<ChangeRequest, Long> {
    
    // Busca por texto parcial ignorando maiúsculas/minúsculas
    List<ChangeRequest> findByDescricaoMudancaContainingIgnoreCase(String descricaoMudanca);
    
    List<ChangeRequest> findByProjetoId(Long projetoId);
}
