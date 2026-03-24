package com.devflow.service;

import com.devflow.dto.CustoCloudRequestDto;
import com.devflow.dto.CustoCloudResponseDto;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.model.CustoCloud;
import com.devflow.model.Projeto;
import com.devflow.repository.CustoCloudRepository;
import com.devflow.repository.ProjetoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustoCloudServiceImpl implements CustoCloudService {

    private final CustoCloudRepository custoCloudRepository;
    private final ProjetoRepository projetoRepository;

    public CustoCloudServiceImpl(CustoCloudRepository custoCloudRepository, ProjetoRepository projetoRepository) {
        this.custoCloudRepository = custoCloudRepository;
        this.projetoRepository = projetoRepository;
    }

    @Override
    @Transactional
    public CustoCloudResponseDto criarCustoCloud(CustoCloudRequestDto request) {
        Projeto projeto = buscarProjeto(request.getProjetoId());

        BigDecimal custoAtual = projeto.getCustoAtualAcumulado() != null ? projeto.getCustoAtualAcumulado() : BigDecimal.ZERO;
        projeto.setCustoAtualAcumulado(custoAtual.add(request.getValorFatura()));
        projetoRepository.save(projeto);

        // 2. Montar e salvar a entidade
        CustoCloud custoCloud = new CustoCloud();
        custoCloud.setProvedor(request.getProvedor());
        custoCloud.setValorFatura(request.getValorFatura());
        custoCloud.setMesReferencia(request.getMesReferencia());
        custoCloud.setProjeto(projeto);

        custoCloud = custoCloudRepository.save(custoCloud);

        return converterParaDto(custoCloud);
    }

    @Override
    public List<CustoCloudResponseDto> listarTodos() {
        return custoCloudRepository.findAll().stream()
                .map(this::converterParaDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CustoCloudResponseDto> listarPorProjeto(Long projetoId) {
        // Valida se o projeto existe antes de buscar
        buscarProjeto(projetoId);

        return custoCloudRepository.findByProjetoId(projetoId).stream()
                .map(this::converterParaDto)
                .collect(Collectors.toList());
    }

    @Override
    public CustoCloudResponseDto buscarCustoCloud(Long id) {
        CustoCloud custoCloud = buscarPorId(id);
        return converterParaDto(custoCloud);
    }

    @Override
    @Transactional
    public CustoCloudResponseDto atualizarCustoCloud(Long id, CustoCloudRequestDto request) {
        CustoCloud custoExistente = buscarPorId(id);

        Projeto projetoAntigo = custoExistente.getProjeto();
        BigDecimal custoSemFaturaAntiga = projetoAntigo.getCustoAtualAcumulado().subtract(custoExistente.getValorFatura());
        projetoAntigo.setCustoAtualAcumulado(custoSemFaturaAntiga);
        projetoRepository.save(projetoAntigo);

        Projeto novoProjeto = buscarProjeto(request.getProjetoId());
        BigDecimal custoAtualNovo = novoProjeto.getCustoAtualAcumulado() != null ? novoProjeto.getCustoAtualAcumulado() : BigDecimal.ZERO;
        novoProjeto.setCustoAtualAcumulado(custoAtualNovo.add(request.getValorFatura()));
        projetoRepository.save(novoProjeto);

        custoExistente.setProvedor(request.getProvedor());
        custoExistente.setValorFatura(request.getValorFatura());
        custoExistente.setMesReferencia(request.getMesReferencia());
        custoExistente.setProjeto(novoProjeto);

        CustoCloud custoAtualizado = custoCloudRepository.save(custoExistente);

        return converterParaDto(custoAtualizado);
    }

    @Override
    @Transactional
    public void deletarCustoCloud(Long id) {
        CustoCloud custoExistente = buscarPorId(id);

        // ESTORNO: Devolver o dinheiro para o caixa do Projeto, já que não vamos mais pagar a fatura
        Projeto projeto = custoExistente.getProjeto();
        if (projeto.getCustoAtualAcumulado() != null) {
            projeto.setCustoAtualAcumulado(projeto.getCustoAtualAcumulado().subtract(custoExistente.getValorFatura()));
            projetoRepository.save(projeto);
        }

        custoCloudRepository.delete(custoExistente);
    }

    // MÉTODOS AUXILIARES (Padrão Clean Code)

    private CustoCloud buscarPorId(Long id) {
        return custoCloudRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fatura de Nuvem não encontrada com ID: " + id));
    }

    private Projeto buscarProjeto(Long id) {
        return projetoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + id));
    }

    private CustoCloudResponseDto converterParaDto(CustoCloud custoCloud) {
        CustoCloudResponseDto response = new CustoCloudResponseDto();
        response.setId(custoCloud.getId());
        response.setProvedor(custoCloud.getProvedor());
        response.setValorFatura(custoCloud.getValorFatura());
        response.setMesReferencia(custoCloud.getMesReferencia());
        
        // Data Flattening
        response.setProjetoId(custoCloud.getProjeto().getId());
        response.setProjetoNome(custoCloud.getProjeto().getNome());
        
        return response;
    }
}
