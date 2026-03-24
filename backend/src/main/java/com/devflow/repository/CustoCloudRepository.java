package com.devflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.devflow.model.CustoCloud;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;

public interface CustoCloudRepository extends JpaRepository<CustoCloud, Long> {
    
    List<CustoCloud> findByProjetoIdAndMesReferencia(Long projetoId,YearMonth mesReferencia);

    List<CustoCloud> findByProjetoId(Long projetoId);

    List<CustoCloud> findByProjetoIdAndValorFatura(Long projeto,BigDecimal valorFatura);
}