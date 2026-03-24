package com.devflow.controller;

import com.devflow.dto.ChangeRequestRequestDto;
import com.devflow.dto.ChangeRequestResponseDto;
import com.devflow.service.ChangeRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/change-requests")
public class ChangeRequestController {

    private final ChangeRequestService changeRequestService;

    public ChangeRequestController(ChangeRequestService changeRequestService) {
        this.changeRequestService = changeRequestService;
    }

    @PostMapping
    public ResponseEntity<ChangeRequestResponseDto> criar(@Valid @RequestBody ChangeRequestRequestDto request) {
        ChangeRequestResponseDto response = changeRequestService.criarChangeRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @GetMapping
    public ResponseEntity<List<ChangeRequestResponseDto>> listarTodos() {
        return ResponseEntity.ok(changeRequestService.listarChangeRequests());
    }
    @GetMapping("/projeto/{projetoId}")
    public ResponseEntity<List<ChangeRequestResponseDto>> listarPorProjeto(@PathVariable Long projetoId) {
        return ResponseEntity.ok(changeRequestService.listarPorProjeto(projetoId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChangeRequestResponseDto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(changeRequestService.buscarChangeRequest(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChangeRequestResponseDto> atualizar(@PathVariable Long id, @Valid @RequestBody ChangeRequestRequestDto request) {
        return ResponseEntity.ok(changeRequestService.atualizarChangeRequest(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        changeRequestService.deletarChangeRequest(id);
        return ResponseEntity.noContent().build();
    }
}