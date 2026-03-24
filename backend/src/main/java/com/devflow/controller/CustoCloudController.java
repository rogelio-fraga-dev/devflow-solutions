package com.devflow.controller;

import com.devflow.dto.CustoCloudRequestDto;
import com.devflow.dto.CustoCloudResponseDto;
import com.devflow.service.CustoCloudService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/custos-cloud")
public class CustoCloudController {

    private final CustoCloudService custoCloudService;

    // Injeção de dependência via construtor (Melhor prática do Spring)
    public CustoCloudController(CustoCloudService custoCloudService) {
        this.custoCloudService = custoCloudService;
    }

    @PostMapping
    public ResponseEntity<CustoCloudResponseDto> criar(@Valid @RequestBody CustoCloudRequestDto request) {
        CustoCloudResponseDto response = custoCloudService.criarCustoCloud(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<CustoCloudResponseDto>> listarTodos() {
        return ResponseEntity.ok(custoCloudService.listarTodos());
    }

    @GetMapping("/projeto/{projetoId}")
    public ResponseEntity<List<CustoCloudResponseDto>> listarPorProjeto(@PathVariable Long projetoId) {
        return ResponseEntity.ok(custoCloudService.listarPorProjeto(projetoId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustoCloudResponseDto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(custoCloudService.buscarCustoCloud(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustoCloudResponseDto> atualizar(@PathVariable Long id, @Valid @RequestBody CustoCloudRequestDto request) {
        return ResponseEntity.ok(custoCloudService.atualizarCustoCloud(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        custoCloudService.deletarCustoCloud(id);
        return ResponseEntity.noContent().build(); // Retorna 204 No Content (Sucesso sem corpo de resposta)
    }
}