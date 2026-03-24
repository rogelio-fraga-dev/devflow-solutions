package com.devflow.controller;

import com.devflow.dto.AnaliseFinanceiraDto;
import com.devflow.service.AnaliseFinanceiraService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/projetos")
public class AnaliseFinanceiraController {

    private final AnaliseFinanceiraService analiseFinanceiraService;

    public AnaliseFinanceiraController(AnaliseFinanceiraService analiseFinanceiraService) {
        this.analiseFinanceiraService = analiseFinanceiraService;
    }

    @GetMapping("/{id}/financeiro/dre")
    public ResponseEntity<AnaliseFinanceiraDto> gerarDre(@PathVariable Long id) {
        AnaliseFinanceiraDto dre = analiseFinanceiraService.gerarDreProjeto(id);
        return ResponseEntity.ok(dre);
    }
}
