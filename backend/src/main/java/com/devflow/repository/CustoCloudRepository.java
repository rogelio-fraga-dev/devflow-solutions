package com.devflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.devflow.model.CustoCloud;
import com.devflow.model.Projeto;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;

public interface CustoCloudRepository extends JpaRepository<CustoCloud, Long> {
    List<CustoCloud> findByProjetoAndMesReferenciaContainingIgnoreCase(
        Projeto projeto,
        YearMonth mesReferencia
    );
    
    List<CustoCloud> findByProjeto(
        Projeto projeto
    );
    
    List<CustoCloud> findByProjetoAndValorFatura(
        Projeto projeto,
        BigDecimal valorFatura
    );
}
