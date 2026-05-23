package com.devflow.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.devflow.model.CustoAdicional;

public interface CustoAdicionalRepository extends JpaRepository<CustoAdicional, Long> {
    List<CustoAdicional> findByDescricaoContainingIgnoreCase(String descricao);
    List<CustoAdicional> findByProjetoId(Long projetoId);
}
