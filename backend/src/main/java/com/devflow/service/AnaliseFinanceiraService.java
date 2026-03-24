package com.devflow.service;

import com.devflow.dto.AnaliseFinanceiraDto;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.model.Projeto;
import com.devflow.model.StatusProjeto;
import com.devflow.repository.ProjetoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class AnaliseFinanceiraService {

    private final ProjetoRepository projetoRepository;

    public AnaliseFinanceiraService(ProjetoRepository projetoRepository) {
        this.projetoRepository = projetoRepository;
    }

    public AnaliseFinanceiraDto gerarDreProjeto(Long projetoId) {
        Projeto projeto = projetoRepository.findById(projetoId)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + projetoId));

        AnaliseFinanceiraDto dre = new AnaliseFinanceiraDto();
        dre.setProjetoId(projeto.getId());
        dre.setNomeProjeto(projeto.getNome());
        dre.setStatusAtual(projeto.getStatus());
        dre.setBudgetTotal(projeto.getBudgetTotal());
        
        BigDecimal custo = projeto.getCustoAtualAcumulado() != null ? projeto.getCustoAtualAcumulado() : BigDecimal.ZERO;
        dre.setCustoAtual(custo);

        // Matemática Executiva - Margem Restante Pura
        BigDecimal margemBruta = projeto.getBudgetTotal().subtract(custo);
        dre.setMargemLucroBruta(margemBruta);

        if (projeto.getBudgetTotal().compareTo(BigDecimal.ZERO) > 0) {
            // (Custo / Budget) * 100
            BigDecimal burnRate = custo.divide(projeto.getBudgetTotal(), 4, RoundingMode.HALF_UP)
                                       .multiply(new BigDecimal("100"));
            dre.setBurnRatePercentual(burnRate.doubleValue());

            // (Margem Bruta / Budget) * 100
            BigDecimal margemPercentual = margemBruta.divide(projeto.getBudgetTotal(), 4, RoundingMode.HALF_UP)
                                               .multiply(new BigDecimal("100"));
            dre.setMargemLucroPercentual(margemPercentual.doubleValue());
            
            // Sinalizador Ativo: Se consumiu 80% ou mais
            dre.setAlertaRiscoImediato(burnRate.compareTo(new BigDecimal("80.00")) >= 0 && projeto.getStatus() == StatusProjeto.ALERTA);
        } else {
            dre.setBurnRatePercentual(0.0);
            dre.setMargemLucroPercentual(0.0);
            dre.setAlertaRiscoImediato(false);
        }

        return dre;
    }
}
