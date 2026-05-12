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

    @GetMapping
    public ResponseEntity<List<TimesheetResponseDto>> listarTodos() {
        return ResponseEntity.ok(timesheetService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<TimesheetResponseDto> registrarHoras(@Valid @RequestBody TimesheetRequestDto request) {
        TimesheetResponseDto response = timesheetService.criarTimesheet(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/desenvolvedor/{desenvolvedorId}")
    public ResponseEntity<List<TimesheetResponseDto>> buscarPorDesenvolvedor(@PathVariable("desenvolvedorId") Long desenvolvedorId) {
        return ResponseEntity.ok(timesheetService.buscarTimesheetPorDesenvolvedor(desenvolvedorId));
    }

    @GetMapping("/sprint/{sprintId}")
    public ResponseEntity<List<TimesheetResponseDto>> buscarPorSprint(@PathVariable("sprintId") Long sprintId) {
        return ResponseEntity.ok(timesheetService.buscarTimesheetPorSprint(sprintId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimesheetResponseDto> atualizar(@PathVariable("id") Long id, @Valid @RequestBody TimesheetRequestDto request) {
        return ResponseEntity.ok(timesheetService.atualizarTimesheet(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable("id") Long id) {
        timesheetService.deletarTimesheet(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/aprovar")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<Void> aprovar(@PathVariable("id") Long id) {
        timesheetService.aprovarTimesheet(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/rejeitar")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<Void> rejeitar(@PathVariable("id") Long id) {
        timesheetService.rejeitarTimesheet(id);
        return ResponseEntity.ok().build();
    }
}

