package com.devflow.service;

import com.devflow.dto.AnaliseFinanceiraDto;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.model.Projeto;
import com.devflow.model.StatusProjeto;
import com.devflow.repository.ProjetoRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import com.devflow.repository.UsuarioRepository;
import com.devflow.repository.TimesheetRepository;
import com.devflow.model.Usuario;
import com.devflow.model.Timesheet;
import com.devflow.model.StatusTimesheet;
import com.devflow.dto.DashboardExecutivoDto;
import com.devflow.dto.ProjetoResumoDto;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Objects;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AnaliseFinanceiraService {

    private final ProjetoRepository projetoRepository;
    private final UsuarioRepository usuarioRepository;
    private final TimesheetRepository timesheetRepository;

    public AnaliseFinanceiraService(ProjetoRepository projetoRepository, 
                                    UsuarioRepository usuarioRepository,
                                    TimesheetRepository timesheetRepository) {
        this.projetoRepository = projetoRepository;
        this.usuarioRepository = usuarioRepository;
        this.timesheetRepository = timesheetRepository;
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

        // --- Lógica de Forecast (Esgotamento de Budget) ---
        LocalDate hoje = LocalDate.now();
        long diasDecorridos = ChronoUnit.DAYS.between(projeto.getDataInicio(), hoje);

        if (diasDecorridos > 0 && custo.compareTo(BigDecimal.ZERO) > 0
                && projeto.getStatus() != StatusProjeto.CONCLUIDO
                && projeto.getStatus() != StatusProjeto.CANCELADO) {

            BigDecimal custoPorDia = custo.divide(
                BigDecimal.valueOf(diasDecorridos), 2, RoundingMode.HALF_UP);

            BigDecimal budgetRestante = projeto.getBudgetTotal().subtract(custo);

            if (custoPorDia.compareTo(BigDecimal.ZERO) > 0
                    && budgetRestante.compareTo(BigDecimal.ZERO) > 0) {
                long diasRestantes = budgetRestante.divide(
                    custoPorDia, 0, RoundingMode.UP).longValue();
                dre.setDiasRestantesEstimados((double) diasRestantes);
                dre.setDataPrevisaoEsgotamento(hoje.plusDays(diasRestantes));
                dre.setMensagemForecast("Budget previsto para esgotar em " + diasRestantes + " dias");
            } else if (budgetRestante.compareTo(BigDecimal.ZERO) <= 0) {
                dre.setDiasRestantesEstimados(0.0);
                dre.setMensagemForecast("Budget esgotado");
            }
        }

        // --- Lógica de Breakdown (Billable vs Non-Billable) ---
        List<Timesheet> timesheets = timesheetRepository.findBySprintProjetoId(projeto.getId());
        double totalBillable = 0.0;
        double totalNonBillable = 0.0;
        BigDecimal custoNonBillable = BigDecimal.ZERO;

        for (Timesheet ts : timesheets) {
            if (ts.getStatusAprovacao() == StatusTimesheet.APROVADO) {
                double horasTs = ts.getHorasTrabalhadas() + (ts.getHorasExtras() != null ? ts.getHorasExtras() : 0.0);
                
                if (Boolean.TRUE.equals(ts.getBillable())) {
                    totalBillable += horasTs;
                } else {
                    totalNonBillable += horasTs;
                    
                    // Calcular o custo destas horas não cobráveis
                    BigDecimal custoTs = BigDecimal.valueOf(ts.getHorasTrabalhadas())
                        .multiply(ts.getDesenvolvedor().getValorHoraCusto());
                    if (ts.getHorasExtras() != null && ts.getHorasExtras() > 0) {
                        custoTs = custoTs.add(BigDecimal.valueOf(ts.getHorasExtras())
                            .multiply(ts.getDesenvolvedor().getValorHoraExtra()));
                    }
                    custoNonBillable = custoNonBillable.add(custoTs);
                }
            }
        }

        dre.setTotalHorasBillable(totalBillable);
        dre.setTotalHorasNonBillable(totalNonBillable);
        dre.setCustoNonBillable(custoNonBillable);

        return dre;
    }

    private Long getEmpresaLogadaId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário logado não encontrado"));
        return usuario.getEmpresa().getId();
    }

    public DashboardExecutivoDto gerarDashboardExecutivo() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário logado não encontrado"));
            
        Long empresaId = usuario.getEmpresa().getId();
        List<Projeto> todosOrig = projetoRepository.findByEmpresaId(empresaId);
        
        java.util.stream.Stream<Projeto> stream = todosOrig.stream();
        if (com.devflow.model.Role.GESTOR == usuario.getRole()) {
            stream = stream.filter(p -> p.getGestorResponsavel() != null && p.getGestorResponsavel().getId().equals(usuario.getId()));
        } else if (com.devflow.model.Role.DESENVOLVEDOR == usuario.getRole()) {
            stream = stream.filter(p -> p.getDesenvolvedores().stream().anyMatch(d -> d.getUsuario() != null && d.getUsuario().getId().equals(usuario.getId())));
        }
        
        List<Projeto> todos = stream.collect(Collectors.toList());

        BigDecimal totalBudget = todos.stream()
            .map(Projeto::getBudgetTotal)
            .filter(Objects::nonNull)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalCusto = todos.stream()
            .map(p -> p.getCustoAtualAcumulado() != null ? p.getCustoAtualAcumulado() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        DashboardExecutivoDto dto = new DashboardExecutivoDto();
        dto.setTotalProjetos(todos.size());
        dto.setProjetosEmAlerta(
            (int) todos.stream().filter(p -> p.getStatus() == StatusProjeto.ALERTA).count());
        dto.setProjetosEstourados(
            (int) todos.stream().filter(p -> p.getStatus() == StatusProjeto.ESTOURADO).count());
        dto.setProjetosEmAndamento(
            (int) todos.stream().filter(p -> p.getStatus() == StatusProjeto.EM_ANDAMENTO).count());
        dto.setInvestimentoTotalAlocado(totalBudget);
        dto.setCustoTotalAcumulado(totalCusto);
        dto.setMargemGlobal(totalBudget.subtract(totalCusto));
        dto.setBurnRateGlobal(totalBudget.compareTo(BigDecimal.ZERO) > 0
            ? totalCusto.divide(totalBudget, 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100")).doubleValue()
            : 0.0);
        dto.setResumoProjetos(todos.stream().map(this::toResumo).collect(Collectors.toList()));
        return dto;
    }

    private ProjetoResumoDto toResumo(Projeto p) {
        ProjetoResumoDto r = new ProjetoResumoDto();
        r.setId(p.getId());
        r.setNome(p.getNome());
        r.setClienteNome(p.getCliente() != null ? p.getCliente().getRazaoSocial() : "Sem cliente");
        r.setBudgetTotal(p.getBudgetTotal());
        BigDecimal custo = p.getCustoAtualAcumulado() != null ? p.getCustoAtualAcumulado() : BigDecimal.ZERO;
        r.setCustoAtual(custo);
        r.setStatus(p.getStatus() != null ? p.getStatus().name() : "RASCUNHO");
        r.setBurnRatePercentual(p.getBudgetTotal() != null && p.getBudgetTotal().compareTo(BigDecimal.ZERO) > 0
            ? custo.divide(p.getBudgetTotal(), 4, RoundingMode.HALF_UP)
                   .multiply(new BigDecimal("100")).doubleValue()
            : 0.0);
        return r;
    }
}
