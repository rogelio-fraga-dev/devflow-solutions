package com.devflow.service;

import com.devflow.dto.ProjetoRequestDto;
import com.devflow.dto.ProjetoResponseDto;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.model.Cliente;
import com.devflow.model.Projeto;
import com.devflow.model.StatusProjeto;
import com.devflow.repository.ClienteRepository;
import com.devflow.repository.ProjetoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
@Service
@Transactional(readOnly = true)
public class ProjetoServiceImpl implements ProjetoService {
    private final ProjetoRepository projetoRepository;
    private final ClienteRepository clienteRepository;
    private final com.devflow.repository.UsuarioRepository usuarioRepository;
    private final com.devflow.repository.DesenvolvedorRepository desenvolvedorRepository;

    public ProjetoServiceImpl(ProjetoRepository projetoRepository, 
                              ClienteRepository clienteRepository,
                              com.devflow.repository.UsuarioRepository usuarioRepository,
                              com.devflow.repository.DesenvolvedorRepository desenvolvedorRepository) {
        this.projetoRepository = projetoRepository;
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.desenvolvedorRepository = desenvolvedorRepository;
    }

    @Override
    @Transactional
    public ProjetoResponseDto criarProjeto(ProjetoRequestDto request) {
        String emailLogado = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        com.devflow.model.Usuario usuarioLogado = usuarioRepository.findByEmailIgnoreCase(emailLogado)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário logado não encontrado"));

        Projeto projeto = new Projeto();
        projeto.setEmpresa(usuarioLogado.getEmpresa());
        projeto.setNome(request.getNome());
        projeto.setStackTecnologica(request.getStackTecnologica());
        projeto.setDescricao(request.getDescricao());
        projeto.setPrioridade(request.getPrioridade());
        projeto.setRiscoAtual(request.getRiscoAtual());
        projeto.setBudgetTotal(request.getBudgetTotal());
        projeto.setDataInicio(request.getDataInicio());
        projeto.setDataPrevisaoEntrega(request.getDataPrevisaoEntrega());

        // Cliente é opcional
        if (request.getClienteId() != null) {
            Cliente cliente = clienteRepository.findById(request.getClienteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + request.getClienteId()));
            projeto.setCliente(cliente);
        }

        // Gestor obrigatório
        com.devflow.model.Usuario gestor = usuarioRepository.findById(request.getGestorId())
                .orElseThrow(() -> new ResourceNotFoundException("Gestor não encontrado com ID: " + request.getGestorId()));
        projeto.setGestorResponsavel(gestor);

        // Desenvolvedores
        if (request.getDesenvolvedoresIds() != null && !request.getDesenvolvedoresIds().isEmpty()) {
            List<com.devflow.model.Desenvolvedor> devs = desenvolvedorRepository.findAllById(request.getDesenvolvedoresIds());
            projeto.setDesenvolvedores(devs);
        }

        // 2. Regras de Inicialização (O sistema define, não o usuário) 
        projeto.setCustoAtualAcumulado(BigDecimal.ZERO); 
        projeto.setStatus(request.getStatus() != null ? request.getStatus() : StatusProjeto.PLANEJADO);

        projeto = projetoRepository.save(projeto);
        return mapToResponse(projeto);
    }

    @Override
    @Transactional
    public ProjetoResponseDto atualizarProjeto(Long id, ProjetoRequestDto request) {
        // 1. REGRA DE OURO: Buscar o projeto existente (Merge)
        Projeto projeto = projetoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + id));

        // 2. Aplicar alterações permitidas
        projeto.setNome(request.getNome());
        projeto.setStackTecnologica(request.getStackTecnologica());
        projeto.setDescricao(request.getDescricao());
        projeto.setPrioridade(request.getPrioridade());
        projeto.setRiscoAtual(request.getRiscoAtual());
        projeto.setBudgetTotal(request.getBudgetTotal());
        projeto.setDataInicio(request.getDataInicio());
        projeto.setDataPrevisaoEntrega(request.getDataPrevisaoEntrega());

        // 3. Checar se o Cliente mudou
        if (request.getClienteId() == null) {
            projeto.setCliente(null);
        } else if (projeto.getCliente() == null || !projeto.getCliente().getId().equals(request.getClienteId())) {
            Cliente novoCliente = clienteRepository.findById(request.getClienteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Novo Cliente não encontrado com ID: " + request.getClienteId()));
            projeto.setCliente(novoCliente);
        }

        // 4. Checar Gestor
        if (request.getGestorId() != null && (projeto.getGestorResponsavel() == null || !projeto.getGestorResponsavel().getId().equals(request.getGestorId()))) {
            com.devflow.model.Usuario novoGestor = usuarioRepository.findById(request.getGestorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Novo Gestor não encontrado"));
            projeto.setGestorResponsavel(novoGestor);
        }

        // 5. Atualizar Desenvolvedores
        if (request.getDesenvolvedoresIds() != null) {
            List<com.devflow.model.Desenvolvedor> devs = desenvolvedorRepository.findAllById(request.getDesenvolvedoresIds());
            projeto.setDesenvolvedores(devs);
        } else {
            projeto.getDesenvolvedores().clear();
        }

        if (request.getStatus() != null) {
            projeto.setStatus(request.getStatus());
        }

        // Obs: Não atualizamos o 'custoAtualAcumulado' por aqui. 
        // O custo será atualizado pelo Motor de Custos (lançamento de horas/despesas) e o status pode também ser alterado por outras regras (Budget Guard).

        projeto = projetoRepository.save(projeto);
        return mapToResponse(projeto);
    }

    @Override
    public ProjetoResponseDto buscarProjeto(Long id) {
        Projeto projeto = projetoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + id));
        return mapToResponse(projeto);
    }

    @Override
    public List<ProjetoResponseDto> listarProjetos() {
        String emailLogado = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        com.devflow.model.Usuario usuario = usuarioRepository.findByEmailIgnoreCase(emailLogado)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário logado não encontrado"));

        List<Projeto> todos = projetoRepository.findByEmpresaId(usuario.getEmpresa().getId());

        java.util.stream.Stream<Projeto> stream = todos.stream();

        if (com.devflow.model.Role.GESTOR == usuario.getRole()) {
            stream = stream.filter(p -> p.getGestorResponsavel() != null && p.getGestorResponsavel().getId().equals(usuario.getId()));
        } else if (com.devflow.model.Role.DESENVOLVEDOR == usuario.getRole()) {
            stream = stream.filter(p -> p.getDesenvolvedores().stream().anyMatch(d -> d.getUsuario() != null && d.getUsuario().getId().equals(usuario.getId())));
        }

        return stream.map(this::mapToResponse).toList();
    }

    @Override
    @Transactional
    public void deletarProjeto(Long id) {
        Projeto projeto = projetoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + id));
        projetoRepository.delete(projeto);
    }

    // O Data Flattening (Achatamento) para o Front-end
    private ProjetoResponseDto mapToResponse(Projeto projeto) {
        ProjetoResponseDto response = new ProjetoResponseDto();
        response.setId(projeto.getId());
        response.setNome(projeto.getNome());
        response.setStackTecnologica(projeto.getStackTecnologica());
        response.setDescricao(projeto.getDescricao());
        response.setPrioridade(projeto.getPrioridade());
        response.setRiscoAtual(projeto.getRiscoAtual());
        response.setBudgetTotal(projeto.getBudgetTotal());
        response.setCustoAtualAcumulado(projeto.getCustoAtualAcumulado());
        response.setDataInicio(projeto.getDataInicio());
        response.setDataPrevisaoEntrega(projeto.getDataPrevisaoEntrega());
        response.setStatus(projeto.getStatus());
        
        // Entregando mastigado para não sobrecarregar o Front-end
        if (projeto.getCliente() != null) {
            response.setClienteId(projeto.getCliente().getId());
            response.setClienteNome(projeto.getCliente().getRazaoSocial());
        }

        if (projeto.getGestorResponsavel() != null) {
            response.setGestorId(projeto.getGestorResponsavel().getId());
            response.setGestorNome(projeto.getGestorResponsavel().getNome());
        }

        if (projeto.getDesenvolvedores() != null) {
            response.setDesenvolvedores(projeto.getDesenvolvedores().stream().map(d -> {
                com.devflow.dto.DesenvolvedorResponseDto dto = new com.devflow.dto.DesenvolvedorResponseDto();
                dto.setId(d.getId());
                dto.setNome(d.getNome());
                dto.setSenioridade(d.getSenioridade());
                dto.setValorHoraCusto(d.getValorHoraCusto());
                dto.setValorHoraExtra(d.getValorHoraExtra());
                if (d.getUsuario() != null) {
                    dto.setUsuarioId(d.getUsuario().getId());
                }
                return dto;
            }).toList());
        }
        
        return response;
    }
}