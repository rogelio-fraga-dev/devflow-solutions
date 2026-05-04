package com.devflow.service;

import com.devflow.dto.ProjetoRequestDto;
import com.devflow.dto.ProjetoResponseDto;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.model.Cliente;
import com.devflow.model.Projeto;
import com.devflow.model.StatusProjeto;
import com.devflow.repository.ClienteRepository;
import com.devflow.repository.ProjetoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProjetoServiceImpl implements ProjetoService {
    private final ProjetoRepository projetoRepository;
    private final ClienteRepository clienteRepository;

    public ProjetoServiceImpl(ProjetoRepository projetoRepository, ClienteRepository clienteRepository) {
        this.projetoRepository = projetoRepository;
        this.clienteRepository = clienteRepository;
    }

    @Override
    @Transactional
    public ProjetoResponseDto criarProjeto(ProjetoRequestDto request) {
        Projeto projeto = new Projeto();
        projeto.setNome(request.getNome());
        projeto.setStackTecnologica(request.getStackTecnologica());
        projeto.setBudgetTotal(request.getBudgetTotal());
        projeto.setDataInicio(request.getDataInicio());
        projeto.setDataPrevisaoEntrega(request.getDataPrevisaoEntrega());
        projeto.setCustoAtualAcumulado(BigDecimal.ZERO);
        projeto.setStatus(request.getStatus() != null ? request.getStatus() : StatusProjeto.PLANEJADO);

        if (request.getClienteId() != null) {
            Cliente cliente = clienteRepository.findById(request.getClienteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + request.getClienteId()));
            projeto.setCliente(cliente);
        }

        return mapToResponse(projetoRepository.save(projeto));
    }

    @Override
    @Transactional
    public ProjetoResponseDto atualizarProjeto(Long id, ProjetoRequestDto request) {
        Projeto projeto = projetoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + id));

        projeto.setNome(request.getNome());
        projeto.setStackTecnologica(request.getStackTecnologica());
        projeto.setBudgetTotal(request.getBudgetTotal());
        projeto.setDataInicio(request.getDataInicio());
        projeto.setDataPrevisaoEntrega(request.getDataPrevisaoEntrega());

        if (request.getStatus() != null) {
            projeto.setStatus(request.getStatus());
        }

        if (request.getClienteId() != null) {
            Long clienteAtualId = projeto.getCliente() != null ? projeto.getCliente().getId() : null;
            if (!request.getClienteId().equals(clienteAtualId)) {
                Cliente novoCliente = clienteRepository.findById(request.getClienteId())
                        .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + request.getClienteId()));
                projeto.setCliente(novoCliente);
            }
        } else {
            projeto.setCliente(null);
        }

        return mapToResponse(projetoRepository.save(projeto));
    }

    @Override
    public ProjetoResponseDto buscarProjeto(Long id) {
        return mapToResponse(projetoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + id)));
    }

    @Override
    public List<ProjetoResponseDto> listarProjetos() {
        return projetoRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public void deletarProjeto(Long id) {
        projetoRepository.delete(projetoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + id)));
    }

    private ProjetoResponseDto mapToResponse(Projeto projeto) {
        ProjetoResponseDto response = new ProjetoResponseDto();
        response.setId(projeto.getId());
        response.setNome(projeto.getNome());
        response.setStackTecnologica(projeto.getStackTecnologica());
        response.setBudgetTotal(projeto.getBudgetTotal());
        response.setCustoAtualAcumulado(projeto.getCustoAtualAcumulado());
        response.setDataInicio(projeto.getDataInicio());
        response.setDataPrevisaoEntrega(projeto.getDataPrevisaoEntrega());
        response.setStatus(projeto.getStatus());

        if (projeto.getCliente() != null) {
            response.setClienteId(projeto.getCliente().getId());
            response.setClienteNome(projeto.getCliente().getRazaoSocial());
        }

        return response;
    }
}
