package com.devflow.service;

import com.devflow.dto.CustoAdicionalRequestDto;
import com.devflow.dto.CustoAdicionalResponseDto;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.model.CustoAdicional;
import com.devflow.model.Projeto;
import com.devflow.repository.CustoAdicionalRepository;
import com.devflow.repository.ProjetoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CustoAdicionalServiceImpl implements CustoAdicionalService {

    private final CustoAdicionalRepository custoAdicionalRepository;
    private final ProjetoRepository projetoRepository;

    public CustoAdicionalServiceImpl(CustoAdicionalRepository custoAdicionalRepository, ProjetoRepository projetoRepository) {
        this.custoAdicionalRepository = custoAdicionalRepository;
        this.projetoRepository = projetoRepository;
    }

    @Override
    @Transactional
    public CustoAdicionalResponseDto criarCustoAdicional(CustoAdicionalRequestDto request) {
        Projeto projeto = buscarProjeto(request.getProjetoId());

        // 1. REGRA FINANCEIRA: Somar o valor adicional ao custo atual acumulado do Projeto
        BigDecimal custoAtual = projeto.getCustoAtualAcumulado() != null ? projeto.getCustoAtualAcumulado() : BigDecimal.ZERO;
        projeto.setCustoAtualAcumulado(custoAtual.add(request.getValorAdicional()));
        projetoRepository.save(projeto);

        CustoAdicional custoAdicional = new CustoAdicional();
        custoAdicional.setDescricao(request.getDescricao());
        custoAdicional.setValorAdicional(request.getValorAdicional());
        custoAdicional.setProjeto(projeto);

        custoAdicional = custoAdicionalRepository.save(custoAdicional);

        return converterParaDto(custoAdicional);
    }

    @Override
    public List<CustoAdicionalResponseDto> listarTodos() {
        return custoAdicionalRepository.findAll().stream()
                .map(this::converterParaDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CustoAdicionalResponseDto> listarPorProjeto(Long projetoId) {
        // Valida se o projeto existe antes de buscar
        buscarProjeto(projetoId);

        return custoAdicionalRepository.findByProjetoId(projetoId).stream()
                .map(this::converterParaDto)
                .collect(Collectors.toList());
    }

    @Override
    public CustoAdicionalResponseDto buscarCustoAdicional(Long id) {
        CustoAdicional custoAdicional = buscarPorId(id);
        return converterParaDto(custoAdicional);
    }

    @Override
    @Transactional
    public CustoAdicionalResponseDto atualizarCustoAdicional(Long id, CustoAdicionalRequestDto request) {
        CustoAdicional custoExistente = buscarPorId(id);

        // 1. ESTORNO: Retirar o custo antigo do projeto antigo
        Projeto projetoAntigo = custoExistente.getProjeto();
        BigDecimal custoSemAdicionalAntigo = projetoAntigo.getCustoAtualAcumulado().subtract(custoExistente.getValorAdicional());
        projetoAntigo.setCustoAtualAcumulado(custoSemAdicionalAntigo);
        projetoRepository.save(projetoAntigo);

        Projeto novoProjeto = buscarProjeto(request.getProjetoId());
        BigDecimal custoAtualNovo = novoProjeto.getCustoAtualAcumulado() != null ? novoProjeto.getCustoAtualAcumulado() : BigDecimal.ZERO;
        novoProjeto.setCustoAtualAcumulado(custoAtualNovo.add(request.getValorAdicional()));
        projetoRepository.save(novoProjeto);

        custoExistente.setDescricao(request.getDescricao());
        custoExistente.setValorAdicional(request.getValorAdicional());
        custoExistente.setProjeto(novoProjeto);

        CustoAdicional custoAtualizado = custoAdicionalRepository.save(custoExistente);

        return converterParaDto(custoAtualizado);
    }

    @Override
    @Transactional
    public void deletarCustoAdicional(Long id) {
        CustoAdicional custoExistente = buscarPorId(id);

        // ESTORNO: Devolver o dinheiro para o caixa do Projeto, já que não temos mais o custo adicional
        Projeto projeto = custoExistente.getProjeto();
        if (projeto.getCustoAtualAcumulado() != null) {
            projeto.setCustoAtualAcumulado(projeto.getCustoAtualAcumulado().subtract(custoExistente.getValorAdicional()));
            projetoRepository.save(projeto);
        }

        custoAdicionalRepository.delete(custoExistente);
    }

    // MÉTODOS AUXILIARES

    private CustoAdicional buscarPorId(Long id) {
        return custoAdicionalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Custo adicional não encontrado com ID: " + id));
    }

    private Projeto buscarProjeto(Long id) {
        return projetoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + id));
    }

    private CustoAdicionalResponseDto converterParaDto(CustoAdicional custoAdicional) {
        CustoAdicionalResponseDto response = new CustoAdicionalResponseDto();
        response.setId(custoAdicional.getId());
        response.setDescricao(custoAdicional.getDescricao());
        response.setValorAdicional(custoAdicional.getValorAdicional());
        
        // Data Flattening
        response.setProjetoId(custoAdicional.getProjeto().getId());
        response.setProjetoNome(custoAdicional.getProjeto().getNome());
        
        return response;
    }
}
