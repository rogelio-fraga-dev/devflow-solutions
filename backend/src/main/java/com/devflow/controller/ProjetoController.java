package com.devflow.controller;

import com.devflow.dto.ProjetoRequestDto;
import com.devflow.dto.ProjetoResponseDto;
import com.devflow.service.ProjetoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/projetos")
public class ProjetoController {
    private final ProjetoService projetoService;

    public ProjetoController(ProjetoService projetoService) {
        this.projetoService = projetoService;
    }

    @PostMapping
    public ResponseEntity<ProjetoResponseDto> criarProjeto(@Valid @RequestBody ProjetoRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projetoService.criarProjeto(request));
    }

    @GetMapping
    public ResponseEntity<List<ProjetoResponseDto>> listarProjetos() {
        return ResponseEntity.ok(projetoService.listarProjetos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjetoResponseDto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(projetoService.buscarProjeto(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjetoResponseDto> atualizarProjeto(@PathVariable Long id, @Valid @RequestBody ProjetoRequestDto request) {
        return ResponseEntity.ok(projetoService.atualizarProjeto(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProjeto(@PathVariable Long id) {
        projetoService.deletarProjeto(id);
        return ResponseEntity.noContent().build();
    }

}
