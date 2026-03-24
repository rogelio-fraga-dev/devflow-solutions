package com.devflow.model;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class ProjetoTest {

    @Test
    void n_deveMudarStatus_quandoCustoEstiverAbaixo80Porcento() {
        // Arrange (R$ 7.500 = 75% de R$ 10.000 — claramente abaixo do limiar de 80%)
        Projeto projeto = new Projeto();
        projeto.setBudgetTotal(new BigDecimal("10000.00"));
        projeto.setCustoAtualAcumulado(new BigDecimal("7500.00")); // 75% exato, sem ambiguidade de arredondamento
        projeto.setStatus(StatusProjeto.EM_ANDAMENTO);

        // Act (Ciclo de vida do JPA simulado)
        projeto.monitorarBudgetGuard();

        // Assert (Motor não deve acionar alerta com 75% do budget)
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
