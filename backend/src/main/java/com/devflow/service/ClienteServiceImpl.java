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
    private final com.devflow.repository.UsuarioRepository usuarioRepository;

    public ClienteServiceImpl(ClienteRepository clienteRepository, com.devflow.repository.UsuarioRepository usuarioRepository) {
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    private Long getEmpresaLogadaId() {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        com.devflow.model.Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário logado não encontrado"));
        return usuario.getEmpresa().getId();
    }

    private com.devflow.model.Empresa getEmpresaLogada() {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        com.devflow.model.Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário logado não encontrado"));
        return usuario.getEmpresa();
    }

    // Isolamento multi-tenant: cliente de outra empresa é tratado como inexistente (404).
    private void assertMesmaEmpresa(Cliente cliente) {
        if (cliente.getEmpresa() == null || !cliente.getEmpresa().getId().equals(getEmpresaLogadaId())) {
            throw new ResourceNotFoundException("Cliente não encontrado com o ID: " + cliente.getId());
        }
    }

    @Override
    @Transactional
    public ClienteResponseDto criarCliente(ClienteRequestDto request) {
        if (request.getCnpj() != null && !request.getCnpj().isBlank()) {
            if (clienteRepository.findByCnpjAndEmpresaId(request.getCnpj(), getEmpresaLogadaId()).isPresent()) {
                throw new ConflictException("Já existe um cliente cadastrado com este CNPJ.");
            }
        }

        Cliente cliente = new Cliente();
        cliente.setRazaoSocial(request.getRazaoSocial());
        cliente.setCnpj(request.getCnpj());
        cliente.setPessoaContato(request.getPessoaContato());
        cliente.setEndereco(request.getEndereco());
        cliente.setEmpresa(getEmpresaLogada());
        cliente.setFoto(request.getFoto());


        cliente = clienteRepository.save(cliente);
        return mapToResponse(cliente);
    }

    @Override
    @Transactional
    public ClienteResponseDto atualizarCliente(Long id, ClienteRequestDto request) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com o ID: " + id));
        assertMesmaEmpresa(cliente);

        String novoCnpj = request.getCnpj();
        if (novoCnpj != null && !novoCnpj.isBlank()) {
            String cnpjAtual = cliente.getCnpj();
            if (!novoCnpj.equals(cnpjAtual)
                    && clienteRepository.findByCnpjAndEmpresaId(novoCnpj, getEmpresaLogadaId()).isPresent()) {
                throw new ConflictException("Já existe outro cliente cadastrado com este CNPJ.");
            }
        }

        cliente.setRazaoSocial(request.getRazaoSocial());
        cliente.setCnpj(request.getCnpj());
        cliente.setPessoaContato(request.getPessoaContato());
        cliente.setEndereco(request.getEndereco());
        cliente.setFoto(request.getFoto());


        cliente = clienteRepository.save(cliente);
        return mapToResponse(cliente);
    }

    @Override
    public ClienteResponseDto buscarCliente(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com o ID: " + id));
        assertMesmaEmpresa(cliente);
        return mapToResponse(cliente);
    }

    @Override
    public List<ClienteResponseDto> listarClientes() {
        return clienteRepository.findByEmpresaId(getEmpresaLogadaId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deletarCliente(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com o ID: " + id));
        assertMesmaEmpresa(cliente);
        clienteRepository.delete(cliente);
    }

    private ClienteResponseDto mapToResponse(Cliente cliente) {
        ClienteResponseDto response = new ClienteResponseDto();
        response.setId(cliente.getId());
        response.setRazaoSocial(cliente.getRazaoSocial());
        response.setCnpj(cliente.getCnpj());
        response.setPessoaContato(cliente.getPessoaContato());
        response.setEndereco(cliente.getEndereco());
        response.setFoto(cliente.getFoto());
        return response;

    }
}
