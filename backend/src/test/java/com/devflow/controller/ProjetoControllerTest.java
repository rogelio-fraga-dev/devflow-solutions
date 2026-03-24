package com.devflow.controller;

import com.devflow.dto.ProjetoResponseDto;
import com.devflow.model.StatusProjeto;
import com.devflow.service.ProjetoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ProjetoControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProjetoService projetoService;

    @InjectMocks
    private ProjetoController projetoController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(projetoController).build();
    }

    @Test
    void deveResponder200_EEmitirPayload_quandoFrontEndDerPost() throws Exception {
        // Arrange (O que o Frontend manda no JSON String bruta)
        String requestJson = """
                {
                   "nome": "Meu Projeto Angular",
                   "stackTecnologica": "Angular 20 e Java 21",
                   "budgetTotal": 150000.00,
                   "dataInicio": "2026-03-24",
                   "clienteId": 1
                }
                """;

        // O que o Motor (Service) teoricamente responde
        ProjetoResponseDto response = new ProjetoResponseDto();
        response.setId(1L);
        response.setNome("Meu Projeto Angular");
        response.setBudgetTotal(new BigDecimal("150000.00"));
        response.setStatus(StatusProjeto.PLANEJADO);

        Mockito.when(projetoService.criarProjeto(any())).thenReturn(response);

        // Act & Assert (Mockando a ida e vinda da API HTTP nativa)
        mockMvc.perform(post("/api/v1/projetos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Meu Projeto Angular"))
                .andExpect(jsonPath("$.status").value("PLANEJADO"))
                .andExpect(jsonPath("$.id").value(1));
    }
}
