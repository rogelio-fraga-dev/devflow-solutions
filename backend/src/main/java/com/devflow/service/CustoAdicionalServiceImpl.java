package com.devflow.service;

import com.devflow.dto.CustoAdicionalRequestDto;
import com.devflow.dto.CustoAdicionalResponseDto;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.model.CustoAdicional;
import com.devflow.model.Projeto;
import com.devflow.repository.CustoAdicionalRepository;
import com.devflow.repository.ProjetoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CustoAdicionalServiceImpl implements CustoAdicionalService {

    private final CustoAdicionalRepository custoAdicionalRepository;
    private final ProjetoRepository projetoRepository;
    private final com.devflow.repository.UsuarioRepository usuarioRepository;

    public CustoAdicionalServiceImpl(CustoAdicionalRepository custoAdicionalRepository, 
                                     ProjetoRepository projetoRepository,
                                     com.devflow.repository.UsuarioRepository usuarioRepository) {
        this.custoAdicionalRepository = custoAdicionalRepository;
        this.projetoRepository = projetoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    @Transactional
    public CustoAdicionalResponseDto criarCustoAdicional(CustoAdicionalRequestDto request) {
        Projeto projeto = buscarProjeto(request.getProjetoId());

        // 1. REGRA FINANCEIRA: Somar o valor adicional ao custo atual acumulado do Projeto
        BigDecimal custoAtual = projeto.getCustoAtualAcumulado() != null ? projeto.getCustoAtualAcumulado() : BigDecimal.ZERO;
        projeto.setCustoAtualAcumulado(custoAtual.add(request.getValorAdicional()));
        projetoRepository.save(projeto);

        CustoAdicional custoAdicional = new CustoAdicional();
        custoAdicional.setDescricao(request.getDescricao());
        custoAdicional.setValorAdicional(request.getValorAdicional());
        custoAdicional.setProjeto(projeto);

        custoAdicional = custoAdicionalRepository.save(custoAdicional);

        return converterParaDto(custoAdicional);
    }

    @Override
    public List<CustoAdicionalResponseDto> listarTodos() {
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

        return custoAdicionalRepository.findAll().stream()
                .filter(ca -> ca.getProjeto() != null && idsProjetosAcessiveis.contains(ca.getProjeto().getId()))
                .map(this::converterParaDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CustoAdicionalResponseDto> listarPorProjeto(Long projetoId) {
        // Valida se o projeto existe antes de buscar
        buscarProjeto(projetoId);

        return custoAdicionalRepository.findByProjetoId(projetoId).stream()
                .map(this::converterParaDto)
                .collect(Collectors.toList());
    }

    @Override
    public CustoAdicionalResponseDto buscarCustoAdicional(Long id) {
        CustoAdicional custoAdicional = buscarPorId(id);
        return converterParaDto(custoAdicional);
    }

    @Override
    @Transactional
    public CustoAdicionalResponseDto atualizarCustoAdicional(Long id, CustoAdicionalRequestDto request) {
        CustoAdicional custoExistente = buscarPorId(id);

        // 1. ESTORNO: Retirar o custo antigo do projeto antigo
        Projeto projetoAntigo = custoExistente.getProjeto();
        BigDecimal custoSemAdicionalAntigo = projetoAntigo.getCustoAtualAcumulado().subtract(custoExistente.getValorAdicional());
        projetoAntigo.setCustoAtualAcumulado(custoSemAdicionalAntigo);
        projetoRepository.save(projetoAntigo);

        Projeto novoProjeto = buscarProjeto(request.getProjetoId());
        BigDecimal custoAtualNovo = novoProjeto.getCustoAtualAcumulado() != null ? novoProjeto.getCustoAtualAcumulado() : BigDecimal.ZERO;
        novoProjeto.setCustoAtualAcumulado(custoAtualNovo.add(request.getValorAdicional()));
        projetoRepository.save(novoProjeto);

        custoExistente.setDescricao(request.getDescricao());
        custoExistente.setValorAdicional(request.getValorAdicional());
        custoExistente.setProjeto(novoProjeto);

        CustoAdicional custoAtualizado = custoAdicionalRepository.save(custoExistente);

        return converterParaDto(custoAtualizado);
    }

    @Override
    @Transactional
    public void deletarCustoAdicional(Long id) {
        CustoAdicional custoExistente = buscarPorId(id);

        // ESTORNO: Devolver o dinheiro para o caixa do Projeto, já que não temos mais o custo adicional
        Projeto projeto = custoExistente.getProjeto();
        if (projeto.getCustoAtualAcumulado() != null) {
            projeto.setCustoAtualAcumulado(projeto.getCustoAtualAcumulado().subtract(custoExistente.getValorAdicional()));
            projetoRepository.save(projeto);
        }

        custoAdicionalRepository.delete(custoExistente);
    }

    // MÉTODOS AUXILIARES

    private Long getEmpresaLogadaId() {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário logado não encontrado"))
                .getEmpresa().getId();
    }

    private CustoAdicional buscarPorId(Long id) {
        CustoAdicional custo = custoAdicionalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Custo adicional não encontrado com ID: " + id));
        // Isolamento multi-tenant via projeto do custo.
        Projeto projeto = custo.getProjeto();
        if (projeto == null || projeto.getEmpresa() == null
                || !projeto.getEmpresa().getId().equals(getEmpresaLogadaId())) {
            throw new ResourceNotFoundException("Custo adicional não encontrado com ID: " + id);
        }
        return custo;
    }

    private Projeto buscarProjeto(Long id) {
        Projeto projeto = projetoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + id));
        if (projeto.getEmpresa() == null || !projeto.getEmpresa().getId().equals(getEmpresaLogadaId())) {
            throw new ResourceNotFoundException("Projeto não encontrado com ID: " + id);
        }
        return projeto;
    }

    private CustoAdicionalResponseDto converterParaDto(CustoAdicional custoAdicional) {
        CustoAdicionalResponseDto response = new CustoAdicionalResponseDto();
        response.setId(custoAdicional.getId());
        response.setDescricao(custoAdicional.getDescricao());
        response.setValorAdicional(custoAdicional.getValorAdicional());
        
        // Data Flattening
        response.setProjetoId(custoAdicional.getProjeto().getId());
        response.setProjetoNome(custoAdicional.getProjeto().getNome());
        
        return response;
    }
}
