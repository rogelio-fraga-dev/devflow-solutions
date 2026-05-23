package com.devflow.controller;

import com.devflow.dto.CustoAdicionalRequestDto;
import com.devflow.dto.CustoAdicionalResponseDto;
import com.devflow.service.CustoAdicionalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/custos-adicionais")
public class CustoAdicionalController {

    private final CustoAdicionalService custoAdicionalService;

    public CustoAdicionalController(CustoAdicionalService custoAdicionalService) {
        this.custoAdicionalService = custoAdicionalService;
    }

    @PostMapping
    public ResponseEntity<CustoAdicionalResponseDto> criar(@Valid @RequestBody CustoAdicionalRequestDto request) {
        CustoAdicionalResponseDto response = custoAdicionalService.criarCustoAdicional(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<CustoAdicionalResponseDto>> listarTodos() {
        return ResponseEntity.ok(custoAdicionalService.listarTodos());
    }

    @GetMapping("/projeto/{projetoId}")
    public ResponseEntity<List<CustoAdicionalResponseDto>> listarPorProjeto(@PathVariable("projetoId") Long projetoId) {
        return ResponseEntity.ok(custoAdicionalService.listarPorProjeto(projetoId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustoAdicionalResponseDto> buscarPorId(@PathVariable("id") Long id) {
        return ResponseEntity.ok(custoAdicionalService.buscarCustoAdicional(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustoAdicionalResponseDto> atualizar(@PathVariable("id") Long id, @Valid @RequestBody CustoAdicionalRequestDto request) {
        return ResponseEntity.ok(custoAdicionalService.atualizarCustoAdicional(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable("id") Long id) {
        custoAdicionalService.deletarCustoAdicional(id);
        return ResponseEntity.noContent().build();
    }
}
