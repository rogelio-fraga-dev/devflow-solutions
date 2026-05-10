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
        if (request.getCnpj() != null && !request.getCnpj().isBlank()) {
            if (clienteRepository.findByCnpj(request.getCnpj()).isPresent()) {
                throw new ConflictException("Já existe um cliente cadastrado com este CNPJ.");
            }
        }

        Cliente cliente = new Cliente();
        cliente.setRazaoSocial(request.getRazaoSocial());
        cliente.setCnpj(request.getCnpj());
        cliente.setPessoaContato(request.getPessoaContato());
        cliente.setEndereco(request.getEndereco());

        cliente = clienteRepository.save(cliente);
        return mapToResponse(cliente);
    }

    @Override
    @Transactional
    public ClienteResponseDto atualizarCliente(Long id, ClienteRequestDto request) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com o ID: " + id));

        String novoCnpj = request.getCnpj();
        if (novoCnpj != null && !novoCnpj.isBlank()) {
            String cnpjAtual = cliente.getCnpj();
            if (!novoCnpj.equals(cnpjAtual) && clienteRepository.findByCnpj(novoCnpj).isPresent()) {
                throw new ConflictException("Já existe outro cliente cadastrado com este CNPJ.");
            }
        }

        cliente.setRazaoSocial(request.getRazaoSocial());
        cliente.setCnpj(request.getCnpj());
        cliente.setPessoaContato(request.getPessoaContato());
        cliente.setEndereco(request.getEndereco());

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
        response.setEndereco(cliente.getEndereco());
        return response;
    }
}
