package com.devflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

import com.devflow.model.Senioridade;

import lombok.Data;

@Data
public class DesenvolvedorRequestDto {
    @NotBlank(message = "O nome é obrigatório")
    private String nome;
    
    @NotBlank(message = "A senioridade é obrigatória")
    private Senioridade senioridade;
    
    @NotNull(message = "O valor da hora custo é obrigatório")
    private BigDecimal valorHoraCusto;
    
    @NotNull(message = "O valor da hora extra é obrigatório")
    private BigDecimal valorHoraExtra;
    
    @NotNull(message = "O ID do usuário é obrigatório")
    private Long usuarioId;
    
    private Long projetoId; // Opcional no momento da criação
}
