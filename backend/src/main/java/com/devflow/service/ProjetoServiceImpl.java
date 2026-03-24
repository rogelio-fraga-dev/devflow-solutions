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

    // Injeção de dependências
    public ProjetoServiceImpl(ProjetoRepository projetoRepository, ClienteRepository clienteRepository) {
        this.projetoRepository = projetoRepository;
        this.clienteRepository = clienteRepository;
    }

    @Override
    @Transactional
    public ProjetoResponseDto criarProjeto(ProjetoRequestDto request) {
        // 1. Regra de Negócio: O Cliente existe?
        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + request.getClienteId()));

        Projeto projeto = new Projeto();
        projeto.setNome(request.getNome());
        projeto.setStackTecnologica(request.getStackTecnologica());
        projeto.setBudgetTotal(request.getBudgetTotal());
        projeto.setDataInicio(request.getDataInicio());
        projeto.setDataPrevisaoEntrega(request.getDataPrevisaoEntrega());
        projeto.setCliente(cliente);

        // 2. Regras de Inicialização (O sistema define, não o usuário) 
        projeto.setCustoAtualAcumulado(BigDecimal.ZERO); 
        projeto.setStatus(StatusProjeto.PLANEJADO);

        projeto = projetoRepository.save(projeto);
        return mapToResponse(projeto);
    }

    @Override
    @Transactional
    public ProjetoResponseDto atualizarProjeto(Long id, ProjetoRequestDto request) {
        // 1. REGRA DE OURO: Buscar o projeto existente (Merge)
        Projeto projeto = projetoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + id));

        // 2. Aplicar alterações permitidas
        projeto.setNome(request.getNome());
        projeto.setStackTecnologica(request.getStackTecnologica());
        projeto.setBudgetTotal(request.getBudgetTotal());
        projeto.setDataInicio(request.getDataInicio());
        projeto.setDataPrevisaoEntrega(request.getDataPrevisaoEntrega());

        // 3. Checar se o Cliente mudou
        if (!projeto.getCliente().getId().equals(request.getClienteId())) {
            Cliente novoCliente = clienteRepository.findById(request.getClienteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Novo Cliente não encontrado com ID: " + request.getClienteId()));
            projeto.setCliente(novoCliente);
        }

        // Obs: Não atualizamos o 'custoAtualAcumulado' nem o 'status' por aqui. 
        // O custo será atualizado pelo Motor de Custos (lançamento de horas/despesas) e o status por outras regras (Budget Guard).

        projeto = projetoRepository.save(projeto);
        return mapToResponse(projeto);
    }

    @Override
    public ProjetoResponseDto buscarProjeto(Long id) {
        Projeto projeto = projetoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + id));
        return mapToResponse(projeto);
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
        Projeto projeto = projetoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + id));
        projetoRepository.delete(projeto);
    }

    // O Data Flattening (Achatamento) para o Front-end
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
        
        // Entregando mastigado para não sobrecarregar o Front-end
        response.setClienteId(projeto.getCliente().getId());
        response.setClienteNome(projeto.getCliente().getRazaoSocial());
        
        return response;
    }
}