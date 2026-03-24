package com.devflow.controller;

import com.devflow.dto.CustoApiRequestDto;
import com.devflow.dto.CustoApiResponseDto;
import com.devflow.service.CustoApiService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/custos-api")
public class CustoApiController {

    private final CustoApiService custoApiService;

    // Injeção de dependência via construtor
    public CustoApiController(CustoApiService custoApiService) {
        this.custoApiService = custoApiService;
    }

    @PostMapping
    public ResponseEntity<CustoApiResponseDto> criar(@Valid @RequestBody CustoApiRequestDto request) {
        CustoApiResponseDto response = custoApiService.criarCustoApi(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<CustoApiResponseDto>> listarTodos() {
        return ResponseEntity.ok(custoApiService.listarTodos());
    }

    @GetMapping("/projeto/{projetoId}")
    public ResponseEntity<List<CustoApiResponseDto>> listarPorProjeto(@PathVariable Long projetoId) {
        return ResponseEntity.ok(custoApiService.listarPorProjeto(projetoId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustoApiResponseDto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(custoApiService.buscarCustoApi(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustoApiResponseDto> atualizar(@PathVariable Long id, @Valid @RequestBody CustoApiRequestDto request) {
        return ResponseEntity.ok(custoApiService.atualizarCustoApi(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        custoApiService.deletarCustoApi(id);
        return ResponseEntity.noContent().build(); // Retorna 204 (Sucesso, sem conteúdo na resposta)
    }
}