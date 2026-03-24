package com.devflow.controller;

import com.devflow.dto.TimesheetResponseDto;
import com.devflow.service.TimesheetService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class TimesheetControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TimesheetService timesheetService;

    @InjectMocks
    private TimesheetController timesheetController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(timesheetController).build();
    }

    @Test
    void deveSalvarHorasComSucessoStatus201_quandoMockadoPeloFront() throws Exception {
        // Arrange
        String requestJson = """
                {
                   "dataRegistro": "2026-03-24",
                   "sprintId": 2,
                   "desenvolvedorId": 3,
                   "descricaoTarefa": "Refatoração API",
                   "horasTrabalhadas": 6.5,
                   "horasExtras": 2.0
                }
                """;

        TimesheetResponseDto response = new TimesheetResponseDto();
        response.setId(5L);
        response.setDescricaoTarefa("Refatoração API");
        response.setHorasTrabalhadas(6.5);
        response.setHorasExtras(2.0);

        Mockito.when(timesheetService.criarTimesheet(any())).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/v1/timesheets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.descricaoTarefa").value("Refatoração API"))
                .andExpect(jsonPath("$.horasTrabalhadas").value(6.5))
                .andExpect(jsonPath("$.horasExtras").value(2.0));
    }
}
