package com.devflow.model;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class ProjetoTest {

    @Test
    void n_deveMudarStatus_quandoCustoEstiverAbaixo80Porcento() {
        // Arrange (Setup do front-end criando projeto com R$ 10.000)
        Projeto projeto = new Projeto();
        projeto.setBudgetTotal(new BigDecimal("10000.00"));
        projeto.setCustoAtualAcumulado(new BigDecimal("7999.99"));
        projeto.setStatus(StatusProjeto.EM_ANDAMENTO);

        // Act (Ciclo de vida do JPA simulado)
        projeto.monitorarBudgetGuard();

        // Assert (Motor não deve acionar alerta)
        assertEquals(StatusProjeto.EM_ANDAMENTO, projeto.getStatus());
    }

    @Test
    void deveMudarStatusParaAlerta_quandoCustoAtingirOuSuperar80Porcento() {
        // Arrange (Setup criando projeto com R$ 10.000)
        Projeto projeto = new Projeto();
        projeto.setBudgetTotal(new BigDecimal("10000.00"));
        projeto.setCustoAtualAcumulado(new BigDecimal("8000.00"));
        projeto.setStatus(StatusProjeto.EM_ANDAMENTO);

        // Act (Ciclo de vida do JPA simulado)
        projeto.monitorarBudgetGuard();

        // Assert (Motor de Inteligência DEVE colocar em Alerta)
        assertEquals(StatusProjeto.ALERTA, projeto.getStatus());
    }
}
