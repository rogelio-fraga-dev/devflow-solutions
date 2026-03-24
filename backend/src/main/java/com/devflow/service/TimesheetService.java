package com.devflow.service;

import com.devflow.dto.TimesheetRequestDto;
import com.devflow.dto.TimesheetResponseDto;
import java.util.List;

public interface TimesheetService {    
    TimesheetResponseDto criarTimesheet(TimesheetRequestDto request);
    List<TimesheetResponseDto> buscarTimesheetPorDesenvolvedor(Long desenvolvedorId);
    List<TimesheetResponseDto> buscarTimesheetPorSprint(Long sprintId);
    TimesheetResponseDto atualizarTimesheet(Long id, TimesheetRequestDto request);
    void deletarTimesheet(Long id);
}
