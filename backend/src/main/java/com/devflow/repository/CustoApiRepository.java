package com.devflow.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.devflow.model.CustoApi;

public interface CustoApiRepository extends JpaRepository<CustoApi, Long> {
    List<CustoApi> findByNomeFerramentaContainingIgnoreCase (String nomeFerramenta);
    List<CustoApi> findByProjetoId(Long projetoId);
}
