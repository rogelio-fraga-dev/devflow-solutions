package com.devflow.service;

import com.devflow.dto.ClienteRequestDto;
import com.devflow.dto.ClienteResponseDto;
import com.devflow.exception.ConflictException;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.model.Cliente;
import com.devflow.repository.ClienteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteServiceImpl(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Override
    @Transactional
    public ClienteResponseDto criarCliente(ClienteRequestDto request) {
        if (clienteRepository.findByCnpj(request.getCnpj()).isPresent()) {
            throw new ConflictException("Já existe um cliente cadastrado com este CNPJ.");
        }

        Cliente cliente = new Cliente();
        cliente.setRazaoSocial(request.getRazaoSocial());
        cliente.setCnpj(request.getCnpj());
        cliente.setPessoaContato(request.getPessoaContato());

        cliente = clienteRepository.save(cliente);
        return mapToResponse(cliente);
    }

    @Override
    @Transactional
    public ClienteResponseDto atualizarCliente(Long id, ClienteRequestDto request) {
        // 1. Buscar a entidade existente (se não existir -> 404)
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com o ID: " + id));

        // 2. Checar duplicidade de CNPJ apenas se estiver alterando para um CNPJ já existente
        if (!cliente.getCnpj().equals(request.getCnpj()) && clienteRepository.findByCnpj(request.getCnpj()).isPresent()) {
            throw new ConflictException("Já existe outro cliente cadastrado com este CNPJ.");
        }

        // 3. Aplicar as alterações campo a campo (Merge controlado, preserva o Endereço)
        cliente.setRazaoSocial(request.getRazaoSocial());
        cliente.setCnpj(request.getCnpj());
        cliente.setPessoaContato(request.getPessoaContato());

        // 4. Salvar e retornar
        cliente = clienteRepository.save(cliente);
        return mapToResponse(cliente);
    }

    @Override
    public ClienteResponseDto buscarCliente(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com o ID: " + id));
        return mapToResponse(cliente);
    }

    @Override
    public List<ClienteResponseDto> listarClientes() {
        return clienteRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deletarCliente(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com o ID: " + id));
        
        clienteRepository.delete(cliente);
    }
    private ClienteResponseDto mapToResponse(Cliente cliente) {
        ClienteResponseDto response = new ClienteResponseDto();
        response.setId(cliente.getId());
        response.setRazaoSocial(cliente.getRazaoSocial());
        response.setCnpj(cliente.getCnpj());
        response.setPessoaContato(cliente.getPessoaContato());
        return response;
    }
}
