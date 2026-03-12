package com.devflow.controller;

import com.devflow.dto.DesenvolvedorRequestDto;
import com.devflow.dto.DesenvolvedorResponseDto;
import com.devflow.service.DesenvolvedorService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/desenvolvedores")
public class DesenvolvedorController {
    public final DesenvolvedorService desenvolvedorService;

    public DesenvolvedorController(DesenvolvedorService desenvolvedorService) {
        this.desenvolvedorService = desenvolvedorService;
    }

    @PostMapping
    public ResponseEntity<DesenvolvedorResponseDto> criar(@RequestBody DesenvolvedorRequestDto request) {
        DesenvolvedorResponseDto response = desenvolvedorService.criarDesenvolvedor(request);
        return ResponseEntity.status(201).body(response);
    }    

    @GetMapping
    public ResponseEntity<List<DesenvolvedorResponseDto>> listar() {
        List<DesenvolvedorResponseDto> response = desenvolvedorService.listarDesenvolvedores();
        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DesenvolvedorResponseDto> buscarPorId(@PathVariable Long id) {
        DesenvolvedorResponseDto response = desenvolvedorService.buscarDesenvolvedor(id);
        return ResponseEntity.status(200).body(response);
    }
}
