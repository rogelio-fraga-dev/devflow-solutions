package com.devflow.controller;

import com.devflow.dto.DesenvolvedorRequestDto;
import com.devflow.dto.DesenvolvedorResponseDto;
import com.devflow.service.DesenvolvedorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/desenvolvedores")
public class DesenvolvedorController {
    public final DesenvolvedorService desenvolvedorService;

    public DesenvolvedorController(DesenvolvedorService desenvolvedorService) {
        this.desenvolvedorService = desenvolvedorService;
    }

    @PostMapping // @Valid faz o Spring ler os @NotNull do DTO antes de entrar no método!
    public ResponseEntity<DesenvolvedorResponseDto> criar(@Valid @RequestBody DesenvolvedorRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(desenvolvedorService.criarDesenvolvedor(request));
    }    

    @GetMapping
    public ResponseEntity<List<DesenvolvedorResponseDto>> listar() {
        return ResponseEntity.ok(desenvolvedorService.listarDesenvolvedores());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DesenvolvedorResponseDto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(desenvolvedorService.buscarDesenvolvedor(id));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<DesenvolvedorResponseDto> atualizar(@PathVariable Long id, @Valid @RequestBody DesenvolvedorRequestDto request) {
        return ResponseEntity.ok(desenvolvedorService.atualizarDesenvolvedor(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        desenvolvedorService.deletarDesenvolvedor(id);
        return ResponseEntity.noContent().build(); // Retorna 204 No Content
    }
}