package com.devflow.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import com.devflow.dto.ChangeRequestRequestDto;
import com.devflow.dto.ChangeRequestResponseDto;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.model.ChangeRequest;
import com.devflow.model.Projeto;
import com.devflow.repository.ChangeRequestRepository;
import com.devflow.repository.ProjetoRepository;

@Service
public class ChangeRequestServiceImpl implements ChangeRequestService {

    private final ChangeRequestRepository changeRequestRepository;
    private final ProjetoRepository projetoRepository;

    public ChangeRequestServiceImpl(ChangeRequestRepository changeRequestRepository, 
                                    ProjetoRepository projetoRepository) {
        this.changeRequestRepository = changeRequestRepository;
        this.projetoRepository = projetoRepository;
    }

    @Override
    @Transactional
    public ChangeRequestResponseDto criarChangeRequest(ChangeRequestRequestDto request) {
        Projeto projeto = buscarProjeto(request.getProjetoId());

        // 1. REGRAS FINANCEIRAS: Adicionar o valor da mudança ao Budget do Projeto
        BigDecimal budgetAtual = projeto.getBudgetTotal() != null ? projeto.getBudgetTotal() : BigDecimal.ZERO;
        projeto.setBudgetTotal(budgetAtual.add(request.getValorAdicional()));
        projetoRepository.save(projeto);

        ChangeRequest cr = new ChangeRequest();
        cr.setDescricaoMudanca(request.getDescricaoMudanca());
        cr.setValorAdicional(request.getValorAdicional());
        cr.setDataAprovacao(request.getDataAprovacao());
        cr.setProjeto(projeto);

        cr = changeRequestRepository.save(cr);

        return converterParaDto(cr);
    }
    @Override
    public List<ChangeRequestResponseDto> listarChangeRequests() {
        // Busca todos no banco e converte um por um para DTO
        return changeRequestRepository.findAll().stream()
                .map(this::converterParaDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ChangeRequestResponseDto> listarPorProjeto(Long projetoId) {
        // Valida se o projeto existe antes de buscar
        buscarProjeto(projetoId);

        return changeRequestRepository.findByProjetoId(projetoId).stream()
                .map(this::converterParaDto)
                .collect(Collectors.toList());
    }
    @Override
    public ChangeRequestResponseDto buscarChangeRequest(Long id) {
        ChangeRequest cr = buscarPorId(id);
        return converterParaDto(cr);
    }

    @Override
    @Transactional
    public ChangeRequestResponseDto atualizarChangeRequest(Long id, ChangeRequestRequestDto request) {
        ChangeRequest crExistente = buscarPorId(id);

        // 1. ESTORNO FINANCEIRO: Remover o valor antigo do Budget do Projeto anterior
        Projeto projetoAntigo = crExistente.getProjeto();
        BigDecimal budgetSemCrAntigo = projetoAntigo.getBudgetTotal().subtract(crExistente.getValorAdicional());
        projetoAntigo.setBudgetTotal(budgetSemCrAntigo);
        projetoRepository.save(projetoAntigo);

        Projeto novoProjeto = buscarProjeto(request.getProjetoId());
        BigDecimal budgetAtualNovo = novoProjeto.getBudgetTotal() != null ? novoProjeto.getBudgetTotal() : BigDecimal.ZERO;
        novoProjeto.setBudgetTotal(budgetAtualNovo.add(request.getValorAdicional()));
        projetoRepository.save(novoProjeto);

        crExistente.setDescricaoMudanca(request.getDescricaoMudanca());
        crExistente.setValorAdicional(request.getValorAdicional());
        crExistente.setDataAprovacao(request.getDataAprovacao());
        crExistente.setProjeto(novoProjeto);

        ChangeRequest crAtualizado = changeRequestRepository.save(crExistente);

        return converterParaDto(crAtualizado);
    }

    @Override
    @Transactional
    public void deletarChangeRequest(Long id) {
        ChangeRequest cr = buscarPorId(id);

        // ESTORNO FINANCEIRO: Se deletar a mudança, o dinheiro extra tem que sair do Budget do Projeto
        Projeto projeto = cr.getProjeto();
        if (projeto.getBudgetTotal() != null) {
            projeto.setBudgetTotal(projeto.getBudgetTotal().subtract(cr.getValorAdicional()));
            projetoRepository.save(projeto);
        }

        changeRequestRepository.delete(cr);
    }

    // MÉTODOS AUXILIARES (Padrão Clean Code)

    private ChangeRequest buscarPorId(Long id) {
        return changeRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Change Request não encontrado com ID: " + id));
    }

    private Projeto buscarProjeto(Long id) {
        return projetoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + id));
    }

    private ChangeRequestResponseDto converterParaDto(ChangeRequest cr) {
        ChangeRequestResponseDto response = new ChangeRequestResponseDto();
        response.setId(cr.getId());
        response.setDescricaoMudanca(cr.getDescricaoMudanca());
        response.setValorAdicional(cr.getValorAdicional());
        response.setDataAprovacao(cr.getDataAprovacao());
        
        // Data Flattening
        response.setProjetoId(cr.getProjeto().getId());
        response.setProjetoNome(cr.getProjeto().getNome());
        
        return response;
    }
}