package com.devflow.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
import com.devflow.model.StatusTimesheet;
import com.devflow.exception.BusinessRuleException;
import com.devflow.repository.DesenvolvedorRepository;
import com.devflow.repository.ProjetoRepository;
import com.devflow.repository.SprintRepository;
import com.devflow.repository.TimesheetRepository;

@Service
@Transactional(readOnly = true)
public class TimesheetServiceImpl implements TimesheetService {

    private final TimesheetRepository timesheetRepository;
    private final DesenvolvedorRepository desenvolvedorRepository;
    private final SprintRepository sprintRepository;
    private final ProjetoRepository projetoRepository;
    private final com.devflow.repository.UsuarioRepository usuarioRepository;

    public TimesheetServiceImpl(TimesheetRepository timesheetRepository, 
                                DesenvolvedorRepository desenvolvedorRepository, 
                                SprintRepository sprintRepository, 
                                ProjetoRepository projetoRepository,
                                com.devflow.repository.UsuarioRepository usuarioRepository) {
        this.timesheetRepository = timesheetRepository;
        this.desenvolvedorRepository = desenvolvedorRepository;
        this.sprintRepository = sprintRepository;
        this.projetoRepository = projetoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    @Transactional
    public TimesheetResponseDto criarTimesheet(TimesheetRequestDto request) {
        Desenvolvedor desenvolvedor = buscarDesenvolvedor(request.getDesenvolvedorId());
        Sprint sprint = buscarSprint(request.getSprintId());

        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        com.devflow.model.Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email).orElse(null);

        if (usuario != null && com.devflow.model.Role.DESENVOLVEDOR == usuario.getRole()) {
            if (desenvolvedor.getUsuario() == null || !desenvolvedor.getUsuario().getId().equals(usuario.getId())) {
                throw new BusinessRuleException("Você só pode lançar horas para si mesmo.");
            }
        }

        if (!sprint.getProjeto().getDesenvolvedores().contains(desenvolvedor)) {
            throw new BusinessRuleException("O desenvolvedor não está vinculado a este projeto.");
        }

        // 1. Salvar a entidade Timesheet como PENDENTE (sem somar custo ainda)
        Timesheet timesheet = new Timesheet();
        timesheet.setDesenvolvedor(desenvolvedor);
        timesheet.setSprint(sprint);
        timesheet.setDataRegistro(request.getDataRegistro());
        timesheet.setHorasTrabalhadas(request.getHorasTrabalhadas());
        timesheet.setHorasExtras(request.getHorasExtras());
        timesheet.setDescricaoTarefa(request.getDescricaoTarefa());
        timesheet.setStatusAprovacao(StatusTimesheet.PENDENTE);
        timesheet.setBillable(request.getBillable() != null ? request.getBillable() : true);

        timesheet = timesheetRepository.save(timesheet);
        return converterParaDto(timesheet);
    }

    @Override
    @Transactional
    public TimesheetResponseDto atualizarTimesheet(Long id, TimesheetRequestDto request) {
        Timesheet timesheetExistente = timesheetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Timesheet não encontrado com ID: " + id));

        // 1. REVERTER o custo antigo se estava APROVADO
        if (timesheetExistente.getStatusAprovacao() == StatusTimesheet.APROVADO) {
            Projeto projetoAntigo = timesheetExistente.getSprint().getProjeto();
            BigDecimal custoAntigo = calcularCusto(
                timesheetExistente.getDesenvolvedor().getValorHoraCusto(), timesheetExistente.getHorasTrabalhadas(),
                timesheetExistente.getDesenvolvedor().getValorHoraExtra(), timesheetExistente.getHorasExtras()
            );
            projetoAntigo.setCustoAtualAcumulado(projetoAntigo.getCustoAtualAcumulado().subtract(custoAntigo));
            projetoRepository.save(projetoAntigo);
        }

        // 2. Buscar novos dados
        Desenvolvedor novoDesenvolvedor = buscarDesenvolvedor(request.getDesenvolvedorId());
        Sprint novaSprint = buscarSprint(request.getSprintId());
        Projeto novoProjeto = novaSprint.getProjeto();

        // 3. Atualizar campos
        timesheetExistente.setDesenvolvedor(novoDesenvolvedor);
        timesheetExistente.setSprint(novaSprint);
        timesheetExistente.setDataRegistro(request.getDataRegistro());
        timesheetExistente.setHorasTrabalhadas(request.getHorasTrabalhadas());
        timesheetExistente.setHorasExtras(request.getHorasExtras());
        timesheetExistente.setDescricaoTarefa(request.getDescricaoTarefa());
        timesheetExistente.setBillable(request.getBillable() != null ? request.getBillable() : true);
        
        // Se mudou algo, volta para pendente
        timesheetExistente.setStatusAprovacao(StatusTimesheet.PENDENTE);

        return converterParaDto(timesheetRepository.save(timesheetExistente));
    }

    @Override
    @Transactional
    public void deletarTimesheet(Long id) {
        Timesheet timesheet = timesheetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Timesheet não encontrado com ID: " + id));

        // 1. REVERTER o custo se estava APROVADO
        if (timesheet.getStatusAprovacao() == StatusTimesheet.APROVADO) {
            Projeto projeto = timesheet.getSprint().getProjeto();
            BigDecimal custoAReverter = calcularCusto(
                timesheet.getDesenvolvedor().getValorHoraCusto(), timesheet.getHorasTrabalhadas(),
                timesheet.getDesenvolvedor().getValorHoraExtra(), timesheet.getHorasExtras()
            );
            
            if (projeto.getCustoAtualAcumulado() != null) {
                projeto.setCustoAtualAcumulado(projeto.getCustoAtualAcumulado().subtract(custoAReverter));
                projetoRepository.save(projeto);
            }
        }

        timesheetRepository.delete(timesheet);
    }

    @Override
    public List<TimesheetResponseDto> listarTodos() {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        com.devflow.model.Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email).orElse(null);
        
        java.util.stream.Stream<Timesheet> stream = timesheetRepository.findAll().stream();
        
        if (usuario != null) {
            stream = stream.filter(t -> t.getSprint() != null && t.getSprint().getProjeto() != null 
                && t.getSprint().getProjeto().getEmpresa() != null 
                && t.getSprint().getProjeto().getEmpresa().getId().equals(usuario.getEmpresa().getId()));
                
            if (com.devflow.model.Role.GESTOR == usuario.getRole()) {
                stream = stream.filter(t -> t.getSprint().getProjeto().getGestorResponsavel() != null 
                    && t.getSprint().getProjeto().getGestorResponsavel().getId().equals(usuario.getId()));
            } else if (com.devflow.model.Role.DESENVOLVEDOR == usuario.getRole()) {
                stream = stream.filter(t -> t.getDesenvolvedor().getUsuario() != null 
                    && t.getDesenvolvedor().getUsuario().getId().equals(usuario.getId()));
            }
        }
        
        return stream.map(this::converterParaDto).collect(Collectors.toList());
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

    @Override
    @Transactional
    public void aprovarTimesheet(Long timesheetId) {
        Timesheet ts = timesheetRepository.findById(timesheetId)
            .orElseThrow(() -> new ResourceNotFoundException("Timesheet não encontrado"));

        if (ts.getStatusAprovacao() != StatusTimesheet.PENDENTE) {
            throw new BusinessRuleException("Timesheet já foi processado.");
        }

        BigDecimal custo = calcularCusto(
            ts.getDesenvolvedor().getValorHoraCusto(), ts.getHorasTrabalhadas(),
            ts.getDesenvolvedor().getValorHoraExtra(), ts.getHorasExtras()
        );

        Projeto projeto = ts.getSprint().getProjeto();
        BigDecimal custoAtual = projeto.getCustoAtualAcumulado() != null ? projeto.getCustoAtualAcumulado() : BigDecimal.ZERO;
        projeto.setCustoAtualAcumulado(custoAtual.add(custo));
        projetoRepository.save(projeto); // dispara Budget Guard

        ts.setStatusAprovacao(StatusTimesheet.APROVADO);
        timesheetRepository.save(ts);
    }

    @Override
    @Transactional
    public void rejeitarTimesheet(Long timesheetId) {
        Timesheet ts = timesheetRepository.findById(timesheetId)
            .orElseThrow(() -> new ResourceNotFoundException("Timesheet não encontrado"));

        if (ts.getStatusAprovacao() != StatusTimesheet.PENDENTE) {
            throw new BusinessRuleException("Timesheet já foi processado.");
        }

        ts.setStatusAprovacao(StatusTimesheet.REJEITADO);
        timesheetRepository.save(ts);
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
        res.setStatusAprovacao(timesheet.getStatusAprovacao());
        res.setBillable(timesheet.getBillable());
        if (timesheet.getSprint() != null && timesheet.getSprint().getProjeto() != null) {
            res.setProjetoId(timesheet.getSprint().getProjeto().getId());
            res.setProjetoNome(timesheet.getSprint().getProjeto().getNome());
        }
        return res;
    }
}