package com.devflow.service;

import com.devflow.dto.AnaliseFinanceiraDto;
import com.devflow.model.Empresa;
import com.devflow.model.Projeto;
import com.devflow.model.StatusProjeto;
import com.devflow.model.Usuario;
import com.devflow.repository.ProjetoRepository;
import com.devflow.repository.TimesheetRepository;
import com.devflow.repository.UsuarioRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AnaliseFinanceiraServiceTest {

    private static final String EMAIL_LOGADO = "gestor@devflow.com";
    private static final Long EMPRESA_ID = 10L;

    @Mock
    private ProjetoRepository projetoRepository;

    @Mock
    private TimesheetRepository timesheetRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private AnaliseFinanceiraService analiseService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // Simula usuário autenticado para a checagem de isolamento multi-tenant
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(EMAIL_LOGADO, null));
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void deveGerarDREDominandoMargemBrutaEBurnRate_ProjetoLucrativo() {
        // Arrange (O que o Banco do Front-end teria)
        Empresa empresa = new Empresa();
        empresa.setId(EMPRESA_ID);

        Projeto projeto = new Projeto();
        projeto.setId(1L);
        projeto.setNome("XPTO SaaS");
        projeto.setStatus(StatusProjeto.EM_ANDAMENTO);
        projeto.setBudgetTotal(new BigDecimal("100000.00")); // R$ 100K
        projeto.setCustoAtualAcumulado(new BigDecimal("40000.00")); // R$ 40K de custos
        projeto.setDataInicio(LocalDate.now()); // evita forecast (0 dias decorridos)
        projeto.setEmpresa(empresa); // mesmo tenant do usuário logado

        Usuario usuarioLogado = new Usuario();
        usuarioLogado.setEmail(EMAIL_LOGADO);
        usuarioLogado.setEmpresa(empresa);

        when(usuarioRepository.findByEmailIgnoreCase(EMAIL_LOGADO)).thenReturn(Optional.of(usuarioLogado));
        when(projetoRepository.findById(1L)).thenReturn(Optional.of(projeto));
        when(timesheetRepository.findBySprintProjetoId(1L)).thenReturn(Collections.emptyList());

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
