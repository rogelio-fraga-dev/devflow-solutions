package com.devflow.controller;

import com.devflow.dto.SprintRequestDto;
import com.devflow.dto.SprintResponseDto;
import com.devflow.service.SprintService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/sprints")
public class SprintController {

    private final SprintService sprintService;

    public SprintController(SprintService sprintService) {
        this.sprintService = sprintService;
    }

    @PostMapping
    public ResponseEntity<SprintResponseDto> criar(@Valid @RequestBody SprintRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sprintService.criarSprint(request));
    }

    // Rota customizada para buscar Sprints de um Projeto específico
    // Exemplo de uso no Front-end: GET /sprints/projeto/5
    @GetMapping("/projeto/{projetoId}")
    public ResponseEntity<List<SprintResponseDto>> listarPorProjeto(@PathVariable Long projetoId) {
        return ResponseEntity.ok(sprintService.listarSprintsPorProjeto(projetoId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SprintResponseDto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(sprintService.buscarSprint(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SprintResponseDto> atualizar(@PathVariable Long id, @Valid @RequestBody SprintRequestDto request) {
        return ResponseEntity.ok(sprintService.atualizarSprint(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        sprintService.deletarSprint(id);
        return ResponseEntity.noContent().build();
    }
}
