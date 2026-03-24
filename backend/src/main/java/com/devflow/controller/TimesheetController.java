package com.devflow.controller;

import com.devflow.dto.TimesheetRequestDto;
import com.devflow.dto.TimesheetResponseDto;
import com.devflow.service.TimesheetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/timesheets")
public class TimesheetController {

    private final TimesheetService timesheetService;

    // Injetamos a Interface (boa prática!) e não a implementação direta
    public TimesheetController(TimesheetService timesheetService) {
        this.timesheetService = timesheetService;
    }

    @PostMapping
    public ResponseEntity<TimesheetResponseDto> registrarHoras(@Valid @RequestBody TimesheetRequestDto request) {
        TimesheetResponseDto response = timesheetService.criarTimesheet(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/desenvolvedor/{desenvolvedorId}")
    public ResponseEntity<List<TimesheetResponseDto>> buscarPorDesenvolvedor(@PathVariable Long desenvolvedorId) {
        return ResponseEntity.ok(timesheetService.buscarTimesheetPorDesenvolvedor(desenvolvedorId));
    }

    @GetMapping("/sprint/{sprintId}")
    public ResponseEntity<List<TimesheetResponseDto>> buscarPorSprint(@PathVariable Long sprintId) {
        return ResponseEntity.ok(timesheetService.buscarTimesheetPorSprint(sprintId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimesheetResponseDto> atualizar(@PathVariable Long id, @Valid @RequestBody TimesheetRequestDto request) {
        return ResponseEntity.ok(timesheetService.atualizarTimesheet(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        timesheetService.deletarTimesheet(id);
        return ResponseEntity.noContent().build();
    }
}
