package com.devflow.model;

public enum StatusProjeto {
    RASCUNHO,
    PLANEJADO,
    EM_ANDAMENTO,
    ALERTA,
    ESTOURADO,  // Budget Guard: >= 100% do orçamento consumido
    PAUSADO,
    CONCLUIDO,
    CANCELADO
}
