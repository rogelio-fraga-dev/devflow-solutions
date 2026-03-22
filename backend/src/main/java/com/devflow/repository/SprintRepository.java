package com.devflow.repository;

import org.springframework.data.jpa.repository.*;

import com.devflow.model.FaseSprint;
import com.devflow.model.Sprint;
import java.util.List;

public interface SprintRepository extends JpaRepository<Sprint, Long> {
    List<Sprint> findByProjetoId(Long projetoId);
    List<Sprint> findByNomeFase(FaseSprint nomeFase);
}
