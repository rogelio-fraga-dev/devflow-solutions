package com.devflow.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.devflow.dto.ClienteRequestDto;
import com.devflow.dto.ClienteResponseDto;
import com.devflow.service.ClienteService;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping
    public ResponseEntity<ClienteResponseDto> criar(@RequestBody ClienteRequestDto request) {
        ClienteResponseDto response = clienteService.criarCliente(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public java.util.List<ClienteResponseDto> listar() {
        return clienteService.listarClientes();
    }

    @GetMapping("/{id}")
    public ClienteResponseDto buscarPorId(@PathVariable Long id) {
        return clienteService.findById(id);
    }
}
