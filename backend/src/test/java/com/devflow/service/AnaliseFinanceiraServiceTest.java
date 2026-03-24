package com.devflow.service;

import com.devflow.dto.AnaliseFinanceiraDto;
import com.devflow.model.Projeto;
import com.devflow.model.StatusProjeto;
import com.devflow.repository.ProjetoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AnaliseFinanceiraServiceTest {

    @Mock
    private ProjetoRepository projetoRepository;

    @InjectMocks
    private AnaliseFinanceiraService analiseService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void deveGerarDREDominandoMargemBrutaEBurnRate_ProjetoLucrativo() {
        // Arrange (O que o Banco do Front-end teria)
        Projeto projeto = new Projeto();
        projeto.setId(1L);
        projeto.setNome("XPTO SaaS");
        projeto.setStatus(StatusProjeto.EM_ANDAMENTO);
        projeto.setBudgetTotal(new BigDecimal("100000.00")); // R$ 100K
        projeto.setCustoAtualAcumulado(new BigDecimal("40000.00")); // R$ 40K de custos
        
        when(projetoRepository.findById(1L)).thenReturn(Optional.of(projeto));

        // Act (Front-end pedindo DRE)
        AnaliseFinanceiraDto dre = analiseService.gerarDreProjeto(1L);

        // Assert (Valida a exatidão financeira exigida na C-Level C-Suite)
        assertNotNull(dre);
        assertEquals(new BigDecimal("40000.00"), dre.getCustoAtual());
        assertEquals(new BigDecimal("60000.00"), dre.getMargemLucroBruta(), "A folga/lucro sobrando é 60K");
        assertEquals(40.0, dre.getBurnRatePercentual(), "Consumiu exatos 40% do orçamento");
        assertEquals(60.0, dre.getMargemLucroPercentual(), "Falta 60% de lucros");
        assertFalse(dre.getAlertaRiscoImediato(), "Projeto está super saudável");

        // Verify se foi ao banco exatamente 1x
        verify(projetoRepository, times(1)).findById(1L);
    }
}
