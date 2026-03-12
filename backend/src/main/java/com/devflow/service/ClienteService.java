package com.devflow.service;

import com.devflow.dto.ClienteRequestDto;
import com.devflow.dto.ClienteResponseDto;
import java.util.List;

public interface ClienteService {
    ClienteResponseDto criarCliente(ClienteRequestDto request);
    List<ClienteResponseDto> listarClientes();
    ClienteResponseDto findById(Long id);
}
