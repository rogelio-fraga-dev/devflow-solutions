package com.devflow.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import com.devflow.dto.ChangeRequestRequestDto;
import com.devflow.dto.ChangeRequestResponseDto;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.model.ChangeRequest;
import com.devflow.model.Projeto;
import com.devflow.repository.ChangeRequestRepository;
import com.devflow.repository.ProjetoRepository;

@Service
@Transactional(readOnly = true)
public class ChangeRequestServiceImpl implements ChangeRequestService {

    private final ChangeRequestRepository changeRequestRepository;
    private final ProjetoRepository projetoRepository;
    private final com.devflow.repository.UsuarioRepository usuarioRepository;

    public ChangeRequestServiceImpl(ChangeRequestRepository changeRequestRepository, 
                                    ProjetoRepository projetoRepository,
                                    com.devflow.repository.UsuarioRepository usuarioRepository) {
        this.changeRequestRepository = changeRequestRepository;
        this.projetoRepository = projetoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    @Transactional
    public ChangeRequestResponseDto criarChangeRequest(ChangeRequestRequestDto request) {
        Projeto projeto = buscarProjeto(request.getProjetoId());

        // 1. REGRAS FINANCEIRAS: Adicionar o valor da mudança ao Budget do Projeto
        BigDecimal budgetAtual = projeto.getBudgetTotal() != null ? projeto.getBudgetTotal() : BigDecimal.ZERO;
        projeto.setBudgetTotal(budgetAtual.add(request.getValorAdicional()));
        projetoRepository.save(projeto);

        ChangeRequest cr = new ChangeRequest();
        cr.setDescricaoMudanca(request.getDescricaoMudanca());
        cr.setValorAdicional(request.getValorAdicional());
        cr.setDataAprovacao(request.getDataAprovacao());
        cr.setStatus(request.getStatus() != null ? request.getStatus() : com.devflow.model.StatusChangeRequest.PENDENTE);
        cr.setImpactoHoras(request.getImpactoHoras());
        cr.setSolicitante(request.getSolicitante());
        cr.setJustificativa(request.getJustificativa());
        cr.setProjeto(projeto);

        cr = changeRequestRepository.save(cr);

        return converterParaDto(cr);
    }
    @Override
    public List<ChangeRequestResponseDto> listarChangeRequests() {
        String emailLogado = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        com.devflow.model.Usuario usuario = usuarioRepository.findByEmailIgnoreCase(emailLogado)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário logado não encontrado"));

        List<Projeto> todosProjetos = projetoRepository.findByEmpresaId(usuario.getEmpresa().getId());
        java.util.stream.Stream<Projeto> streamProjetos = todosProjetos.stream();

        if (com.devflow.model.Role.GESTOR == usuario.getRole()) {
            streamProjetos = streamProjetos.filter(p -> p.getGestorResponsavel() != null && p.getGestorResponsavel().getId().equals(usuario.getId()));
        } else if (com.devflow.model.Role.DESENVOLVEDOR == usuario.getRole()) {
            streamProjetos = streamProjetos.filter(p -> p.getDesenvolvedores().stream().anyMatch(d -> d.getUsuario() != null && d.getUsuario().getId().equals(usuario.getId())));
        }

        java.util.Set<Long> idsProjetosAcessiveis = streamProjetos.map(Projeto::getId).collect(Collectors.toSet());

        return changeRequestRepository.findAll().stream()
                .filter(cr -> cr.getProjeto() != null && idsProjetosAcessiveis.contains(cr.getProjeto().getId()))
                .map(this::converterParaDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ChangeRequestResponseDto> listarPorProjeto(Long projetoId) {
        // Valida se o projeto existe antes de buscar
        buscarProjeto(projetoId);

        return changeRequestRepository.findByProjetoId(projetoId).stream()
                .map(this::converterParaDto)
                .collect(Collectors.toList());
    }
    @Override
    public ChangeRequestResponseDto buscarChangeRequest(Long id) {
        ChangeRequest cr = buscarPorId(id);
        return converterParaDto(cr);
    }

    @Override
    @Transactional
    public ChangeRequestResponseDto atualizarChangeRequest(Long id, ChangeRequestRequestDto request) {
        ChangeRequest crExistente = buscarPorId(id);

        // 1. ESTORNO FINANCEIRO: Remover o valor antigo do Budget do Projeto anterior
        Projeto projetoAntigo = crExistente.getProjeto();
        BigDecimal budgetSemCrAntigo = projetoAntigo.getBudgetTotal().subtract(crExistente.getValorAdicional());
        projetoAntigo.setBudgetTotal(budgetSemCrAntigo);
        projetoRepository.save(projetoAntigo);

        Projeto novoProjeto = buscarProjeto(request.getProjetoId());
        BigDecimal budgetAtualNovo = novoProjeto.getBudgetTotal() != null ? novoProjeto.getBudgetTotal() : BigDecimal.ZERO;
        novoProjeto.setBudgetTotal(budgetAtualNovo.add(request.getValorAdicional()));
        projetoRepository.save(novoProjeto);

        crExistente.setDescricaoMudanca(request.getDescricaoMudanca());
        crExistente.setValorAdicional(request.getValorAdicional());
        crExistente.setDataAprovacao(request.getDataAprovacao());
        if (request.getStatus() != null) {
            crExistente.setStatus(request.getStatus());
        }
        crExistente.setImpactoHoras(request.getImpactoHoras());
        crExistente.setSolicitante(request.getSolicitante());
        crExistente.setJustificativa(request.getJustificativa());
        crExistente.setProjeto(novoProjeto);

        ChangeRequest crAtualizado = changeRequestRepository.save(crExistente);

        return converterParaDto(crAtualizado);
    }

    @Override
    @Transactional
    public void deletarChangeRequest(Long id) {
        ChangeRequest cr = buscarPorId(id);

        // ESTORNO FINANCEIRO: Se deletar a mudança, o dinheiro extra tem que sair do Budget do Projeto
        Projeto projeto = cr.getProjeto();
        if (projeto.getBudgetTotal() != null) {
            projeto.setBudgetTotal(projeto.getBudgetTotal().subtract(cr.getValorAdicional()));
            projetoRepository.save(projeto);
        }

        changeRequestRepository.delete(cr);
    }

    // MÉTODOS AUXILIARES (Padrão Clean Code)

    private Long getEmpresaLogadaId() {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário logado não encontrado"))
                .getEmpresa().getId();
    }

    private ChangeRequest buscarPorId(Long id) {
        ChangeRequest cr = changeRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Change Request não encontrado com ID: " + id));
        // Isolamento multi-tenant via projeto do change request.
        Projeto projeto = cr.getProjeto();
        if (projeto == null || projeto.getEmpresa() == null
                || !projeto.getEmpresa().getId().equals(getEmpresaLogadaId())) {
            throw new ResourceNotFoundException("Change Request não encontrado com ID: " + id);
        }
        return cr;
    }

    private Projeto buscarProjeto(Long id) {
        Projeto projeto = projetoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + id));
        if (projeto.getEmpresa() == null || !projeto.getEmpresa().getId().equals(getEmpresaLogadaId())) {
            throw new ResourceNotFoundException("Projeto não encontrado com ID: " + id);
        }
        return projeto;
    }

    private ChangeRequestResponseDto converterParaDto(ChangeRequest cr) {
        ChangeRequestResponseDto response = new ChangeRequestResponseDto();
        response.setId(cr.getId());
        response.setDescricaoMudanca(cr.getDescricaoMudanca());
        response.setValorAdicional(cr.getValorAdicional());
        response.setDataAprovacao(cr.getDataAprovacao());
        response.setStatus(cr.getStatus());
        response.setImpactoHoras(cr.getImpactoHoras());
        response.setSolicitante(cr.getSolicitante());
        response.setJustificativa(cr.getJustificativa());
        
        // Data Flattening
        response.setProjetoId(cr.getProjeto().getId());
        response.setProjetoNome(cr.getProjeto().getNome());
        
        return response;
    }
}
