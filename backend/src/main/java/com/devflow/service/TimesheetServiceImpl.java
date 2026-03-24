package com.devflow.service;

import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import com.devflow.dto.TimesheetRequestDto;
import com.devflow.dto.TimesheetResponseDto;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.model.Desenvolvedor;
import com.devflow.model.Projeto;
import com.devflow.model.Sprint;
import com.devflow.model.Timesheet;
import com.devflow.repository.DesenvolvedorRepository;
import com.devflow.repository.ProjetoRepository;
import com.devflow.repository.SprintRepository;
import com.devflow.repository.TimesheetRepository;

@Service
public class TimesheetServiceImpl implements TimesheetService {

    private final TimesheetRepository timesheetRepository;
    private final DesenvolvedorRepository desenvolvedorRepository;
    private final SprintRepository sprintRepository;
    private final ProjetoRepository projetoRepository;

    public TimesheetServiceImpl(TimesheetRepository timesheetRepository, 
                                DesenvolvedorRepository desenvolvedorRepository, 
                                SprintRepository sprintRepository, 
                                ProjetoRepository projetoRepository) {
        this.timesheetRepository = timesheetRepository;
        this.desenvolvedorRepository = desenvolvedorRepository;
        this.sprintRepository = sprintRepository;
        this.projetoRepository = projetoRepository;
    }

    @Override
    @Transactional
    public TimesheetResponseDto criarTimesheet(TimesheetRequestDto request) {
        Desenvolvedor desenvolvedor = buscarDesenvolvedor(request.getDesenvolvedorId());
        Sprint sprint = buscarSprint(request.getSprintId());
        Projeto projeto = sprint.getProjeto();

        // 1. Calcular custo total (Normal + Extra)
        BigDecimal custoDaTarefa = calcularCusto(
            desenvolvedor.getValorHoraCusto(), request.getHorasTrabalhadas(),
            desenvolvedor.getValorHoraExtra(), request.getHorasExtras()
        );

        // 2. Atualizar o acumulado do Projeto
        BigDecimal custoAtual = projeto.getCustoAtualAcumulado() != null ? projeto.getCustoAtualAcumulado() : BigDecimal.ZERO;
        projeto.setCustoAtualAcumulado(custoAtual.add(custoDaTarefa));
        projetoRepository.save(projeto);

        // 3. Salvar a entidade Timesheet
        Timesheet timesheet = new Timesheet();
        timesheet.setDesenvolvedor(desenvolvedor);
        timesheet.setSprint(sprint);
        timesheet.setDataRegistro(request.getDataRegistro());
        timesheet.setHorasTrabalhadas(request.getHorasTrabalhadas());
        timesheet.setHorasExtras(request.getHorasExtras()); // Agora o modelo suporta!
        timesheet.setDescricaoTarefa(request.getDescricaoTarefa());

        timesheet = timesheetRepository.save(timesheet);
        return converterParaDto(timesheet);
    }

    @Override
    @Transactional
    public TimesheetResponseDto atualizarTimesheet(Long id, TimesheetRequestDto request) {
        Timesheet timesheetExistente = timesheetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Timesheet não encontrado com ID: " + id));

        // 1. REVERTER o custo antigo do Projeto (usando os dados que já estavam no banco)
        Projeto projetoAntigo = timesheetExistente.getSprint().getProjeto();
        BigDecimal custoAntigo = calcularCusto(
            timesheetExistente.getDesenvolvedor().getValorHoraCusto(), timesheetExistente.getHorasTrabalhadas(),
            timesheetExistente.getDesenvolvedor().getValorHoraExtra(), timesheetExistente.getHorasExtras()
        );
        projetoAntigo.setCustoAtualAcumulado(projetoAntigo.getCustoAtualAcumulado().subtract(custoAntigo));
        projetoRepository.save(projetoAntigo);

        // 2. Buscar novos dados
        Desenvolvedor novoDesenvolvedor = buscarDesenvolvedor(request.getDesenvolvedorId());
        Sprint novaSprint = buscarSprint(request.getSprintId());
        Projeto novoProjeto = novaSprint.getProjeto();

        // 3. APLICAR o novo custo (Normal + Extra do Request)
        BigDecimal custoNovo = calcularCusto(
            novoDesenvolvedor.getValorHoraCusto(), request.getHorasTrabalhadas(),
            novoDesenvolvedor.getValorHoraExtra(), request.getHorasExtras()
        );
        BigDecimal saldoAtualNovo = novoProjeto.getCustoAtualAcumulado() != null ? novoProjeto.getCustoAtualAcumulado() : BigDecimal.ZERO;
        novoProjeto.setCustoAtualAcumulado(saldoAtualNovo.add(custoNovo));
        projetoRepository.save(novoProjeto);

        // 4. Atualizar campos
        timesheetExistente.setDesenvolvedor(novoDesenvolvedor);
        timesheetExistente.setSprint(novaSprint);
        timesheetExistente.setDataRegistro(request.getDataRegistro());
        timesheetExistente.setHorasTrabalhadas(request.getHorasTrabalhadas());
        timesheetExistente.setHorasExtras(request.getHorasExtras());
        timesheetExistente.setDescricaoTarefa(request.getDescricaoTarefa());

        return converterParaDto(timesheetRepository.save(timesheetExistente));
    }

    @Override
    @Transactional
    public void deletarTimesheet(Long id) {
        Timesheet timesheet = timesheetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Timesheet não encontrado com ID: " + id));

        // 1. REVERTER o custo total antes de deletar
        Projeto projeto = timesheet.getSprint().getProjeto();
        BigDecimal custoAReverter = calcularCusto(
            timesheet.getDesenvolvedor().getValorHoraCusto(), timesheet.getHorasTrabalhadas(),
            timesheet.getDesenvolvedor().getValorHoraExtra(), timesheet.getHorasExtras()
        );
        
        if (projeto.getCustoAtualAcumulado() != null) {
            projeto.setCustoAtualAcumulado(projeto.getCustoAtualAcumulado().subtract(custoAReverter));
            projetoRepository.save(projeto);
        }

        timesheetRepository.delete(timesheet);
    }

    @Override
    public List<TimesheetResponseDto> buscarTimesheetPorDesenvolvedor(Long desenvolvedorId) {
        buscarDesenvolvedor(desenvolvedorId);
        return timesheetRepository.findByDesenvolvedorId(desenvolvedorId).stream()
                .map(this::converterParaDto).collect(Collectors.toList());
    }

    @Override
    public List<TimesheetResponseDto> buscarTimesheetPorSprint(Long sprintId) {
        buscarSprint(sprintId);
        return timesheetRepository.findBySprintId(sprintId).stream()
                .map(this::converterParaDto).collect(Collectors.toList());
    }

    // --- MÉTODOS AUXILIARES ---

    private BigDecimal calcularCusto(BigDecimal vNormal, Double hNormal, BigDecimal vExtra, Double hExtra) {
        BigDecimal totalNormal = vNormal.multiply(BigDecimal.valueOf(hNormal != null ? hNormal : 0.0));
        
        // Proteção contra nulos no valor ou na quantidade de horas extras
        BigDecimal valorDaExtra = vExtra != null ? vExtra : BigDecimal.ZERO;
        BigDecimal qtdExtra = BigDecimal.valueOf(hExtra != null ? hExtra : 0.0);
        
        BigDecimal totalExtra = valorDaExtra.multiply(qtdExtra);
        
        return totalNormal.add(totalExtra);
    }

    private Desenvolvedor buscarDesenvolvedor(Long id) {
        return desenvolvedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Desenvolvedor não encontrado: " + id));
    }

    private Sprint buscarSprint(Long id) {
        return sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint não encontrada: " + id));
    }

    private TimesheetResponseDto converterParaDto(Timesheet timesheet) {
        TimesheetResponseDto res = new TimesheetResponseDto();
        res.setId(timesheet.getId());
        res.setDataRegistro(timesheet.getDataRegistro());
        res.setHorasTrabalhadas(timesheet.getHorasTrabalhadas());
        res.setHorasExtras(timesheet.getHorasExtras());
        res.setDescricaoTarefa(timesheet.getDescricaoTarefa());
        res.setDesenvolvedorId(timesheet.getDesenvolvedor().getId());
        res.setDesenvolvedorNome(timesheet.getDesenvolvedor().getNome());
        res.setSprintId(timesheet.getSprint().getId());
        res.setSprintNome(timesheet.getSprint().getNomeFase().name());
        return res;
    }
}