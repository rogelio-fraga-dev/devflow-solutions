package com.devflow.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.devflow.dto.ClienteRequestDto;
import com.devflow.dto.ClienteResponseDto;
import com.devflow.model.Cliente;
import com.devflow.repository.ClienteRepository;


@Service
public class ClienteServiceImpl implements ClienteService {
    
    private final ClienteRepository clienteRepository;

    public ClienteServiceImpl(ClienteRepository clienteRepository){
        this.clienteRepository = clienteRepository;
    }
    @Override
    public ClienteResponseDto criarCliente(ClienteRequestDto request) {
        Cliente cliente = mapRequestToEntity(request);
        Cliente savedCliente = clienteRepository.save(cliente);
        return mapEntityToResponse(savedCliente);
    }
    @Override
    public List<ClienteResponseDto> listarClientes() {
        List<Cliente> clientes = clienteRepository.findAll();
        return clientes.stream()
            .map(this::mapEntityToResponse)
            .toList();
    }
    @Override
    public ClienteResponseDto buscarCliente(Long id) {
        Cliente cliente = clienteRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        return mapEntityToResponse(cliente);
    }

    private Cliente mapRequestToEntity(ClienteRequestDto request) {
        Cliente cliente = new Cliente();
        cliente.setRazaoSocial(request.getRazaoSocial());
        cliente.setCnpj(request.getCnpj());
        cliente.setPessoaContato(request.getPessoaContato());
        return cliente;        
    }
    private ClienteResponseDto mapEntityToResponse(Cliente cliente) {
        ClienteResponseDto response = new ClienteResponseDto();
        response.setId(cliente.getId());
        response.setRazaoSocial(cliente.getRazaoSocial());
        response.setCnpj(cliente.getCnpj());
        response.setPessoaContato(cliente.getPessoaContato());
        return response;        
    }
    @Override
    public ClienteResponseDto atualizarCliente(Long id, ClienteRequestDto request) {
        Cliente cliente = mapRequestToEntity(request);
        cliente.setId(id);
        Cliente clienteAtualizado = clienteRepository.save(cliente);
        return mapEntityToResponse(clienteAtualizado);
    }
    @Override
    public void deletarCliente(Long id) {
        clienteRepository.deleteById(id);
    }

    
}
