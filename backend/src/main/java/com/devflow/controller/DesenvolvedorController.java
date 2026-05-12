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
@RequestMapping("/api/v1/desenvolvedores")
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
    public ResponseEntity<DesenvolvedorResponseDto> buscarPorId(@PathVariable("id") Long id) {
        return ResponseEntity.ok(desenvolvedorService.buscarDesenvolvedor(id));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<DesenvolvedorResponseDto> atualizar(@PathVariable("id") Long id, @Valid @RequestBody DesenvolvedorRequestDto request) {
        return ResponseEntity.ok(desenvolvedorService.atualizarDesenvolvedor(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable("id") Long id) {
        desenvolvedorService.deletarDesenvolvedor(id);
        return ResponseEntity.noContent().build(); // Retorna 204 No Content
    }

    @GetMapping("/produtividade")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN','GESTOR')")
    public ResponseEntity<List<com.devflow.dto.ProdutividadeDevDto>> ranking() {
        return ResponseEntity.ok(desenvolvedorService.gerarRankingProdutividade());
    }
}
