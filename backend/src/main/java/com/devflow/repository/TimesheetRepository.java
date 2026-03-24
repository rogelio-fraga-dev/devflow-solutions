package com.devflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.devflow.model.Desenvolvedor;
import com.devflow.model.Sprint;
import com.devflow.model.Timesheet;
import java.util.List;

public interface TimesheetRepository extends JpaRepository<Timesheet, Long> {
    List<Timesheet> findByDesenvolvedorAndSprint (Desenvolvedor desenvolvedor, Sprint sprint);
    List<Timesheet> findBySprintId (Long sprintId);
    List<Timesheet> findByDesenvolvedorId (Long desenvolvedorId);
}