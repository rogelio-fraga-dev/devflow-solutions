package com.devflow.service;

import com.devflow.dto.CustoApiRequestDto;
import com.devflow.dto.CustoApiResponseDto;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.model.CustoApi;
import com.devflow.model.Projeto;
import com.devflow.repository.CustoApiRepository;
import com.devflow.repository.ProjetoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustoApiServiceImpl implements CustoApiService {

    private final CustoApiRepository custoApiRepository;
    private final ProjetoRepository projetoRepository;

    public CustoApiServiceImpl(CustoApiRepository custoApiRepository, ProjetoRepository projetoRepository) {
        this.custoApiRepository = custoApiRepository;
        this.projetoRepository = projetoRepository;
    }

    @Override
    @Transactional
    public CustoApiResponseDto criarCustoApi(CustoApiRequestDto request) {
        Projeto projeto = buscarProjeto(request.getProjetoId());

        // 1. REGRA FINANCEIRA: Somar o valor da licença ao custo atual do Projeto
        BigDecimal custoAtual = projeto.getCustoAtualAcumulado() != null ? projeto.getCustoAtualAcumulado() : BigDecimal.ZERO;
        projeto.setCustoAtualAcumulado(custoAtual.add(request.getValorLicenca()));
        projetoRepository.save(projeto);

        CustoApi custoApi = new CustoApi();
        custoApi.setNomeFerramenta(request.getNomeFerramenta());
        custoApi.setValorLicenca(request.getValorLicenca());
        custoApi.setProjeto(projeto);

        custoApi = custoApiRepository.save(custoApi);

        return converterParaDto(custoApi);
    }

    @Override
    public List<CustoApiResponseDto> listarTodos() {
        return custoApiRepository.findAll().stream()
                .map(this::converterParaDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CustoApiResponseDto> listarPorProjeto(Long projetoId) {
        // Valida se o projeto existe antes de buscar
        buscarProjeto(projetoId);

        return custoApiRepository.findByProjetoId(projetoId).stream()
                .map(this::converterParaDto)
                .collect(Collectors.toList());
    }

    @Override
    public CustoApiResponseDto buscarCustoApi(Long id) {
        CustoApi custoApi = buscarPorId(id);
        return converterParaDto(custoApi);
    }

    @Override
    @Transactional
    public CustoApiResponseDto atualizarCustoApi(Long id, CustoApiRequestDto request) {
        CustoApi custoExistente = buscarPorId(id);

        // 1. ESTORNO: Retirar o custo antigo do projeto antigo
        Projeto projetoAntigo = custoExistente.getProjeto();
        BigDecimal custoSemApiAntiga = projetoAntigo.getCustoAtualAcumulado().subtract(custoExistente.getValorLicenca());
        projetoAntigo.setCustoAtualAcumulado(custoSemApiAntiga);
        projetoRepository.save(projetoAntigo);

        Projeto novoProjeto = buscarProjeto(request.getProjetoId());
        BigDecimal custoAtualNovo = novoProjeto.getCustoAtualAcumulado() != null ? novoProjeto.getCustoAtualAcumulado() : BigDecimal.ZERO;
        novoProjeto.setCustoAtualAcumulado(custoAtualNovo.add(request.getValorLicenca()));
        projetoRepository.save(novoProjeto);

        custoExistente.setNomeFerramenta(request.getNomeFerramenta());
        custoExistente.setValorLicenca(request.getValorLicenca());
        custoExistente.setProjeto(novoProjeto);

        CustoApi custoAtualizado = custoApiRepository.save(custoExistente);

        return converterParaDto(custoAtualizado);
    }

    @Override
    @Transactional
    public void deletarCustoApi(Long id) {
        CustoApi custoExistente = buscarPorId(id);

        // ESTORNO: Devolver o dinheiro para o caixa do Projeto, já que não vamos mais pagar a licença
        Projeto projeto = custoExistente.getProjeto();
        if (projeto.getCustoAtualAcumulado() != null) {
            projeto.setCustoAtualAcumulado(projeto.getCustoAtualAcumulado().subtract(custoExistente.getValorLicenca()));
            projetoRepository.save(projeto);
        }

        custoApiRepository.delete(custoExistente);
    }

    // MÉTODOS AUXILIARES (Padrão Clean Code)

    private CustoApi buscarPorId(Long id) {
        return custoApiRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Custo de API não encontrado com ID: " + id));
    }

    private Projeto buscarProjeto(Long id) {
        return projetoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + id));
    }

    private CustoApiResponseDto converterParaDto(CustoApi custoApi) {
        CustoApiResponseDto response = new CustoApiResponseDto();
        response.setId(custoApi.getId());
        response.setNomeFerramenta(custoApi.getNomeFerramenta());
        response.setValorLicenca(custoApi.getValorLicenca());
        
        // Data Flattening
        response.setProjetoId(custoApi.getProjeto().getId());
        response.setProjetoNome(custoApi.getProjeto().getNome());
        
        return response;
    }
}