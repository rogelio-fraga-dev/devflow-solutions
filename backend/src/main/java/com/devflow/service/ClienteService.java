package com.devflow.service;

import com.devflow.dto.ClienteRequestDto;
import com.devflow.dto.ClienteResponseDto;
import java.util.List;

public interface ClienteService {
    ClienteResponseDto criarCliente(ClienteRequestDto request);
    List<ClienteResponseDto> listarClientes();
    ClienteResponseDto buscarCliente(Long id);
    ClienteResponseDto atualizarCliente(Long id, ClienteRequestDto request);
    void deletarCliente(Long id);
}
