package com.devflow.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.devflow.dto.DesenvolvedorRequestDto;
import com.devflow.dto.DesenvolvedorResponseDto;
import com.devflow.model.Desenvolvedor;
import com.devflow.model.Projeto;
import com.devflow.model.Usuario;
import com.devflow.repository.DesenvolvedorRepository;
import com.devflow.repository.ProjetoRepository;
import com.devflow.repository.UsuarioRepository;
import com.devflow.exception.ResourceNotFoundException;

import com.devflow.dto.ProdutividadeDevDto;
import com.devflow.model.Senioridade;
import org.springframework.security.core.context.SecurityContextHolder;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DesenvolvedorServiceImpl implements DesenvolvedorService {

    private final DesenvolvedorRepository desenvolvedorRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProjetoRepository projetoRepository;

    public DesenvolvedorServiceImpl(
            DesenvolvedorRepository desenvolvedorRepository,
            UsuarioRepository usuarioRepository,
            ProjetoRepository projetoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.projetoRepository = projetoRepository;
        this.desenvolvedorRepository = desenvolvedorRepository;
    }

    @Override
    @Transactional
    public DesenvolvedorResponseDto criarDesenvolvedor(DesenvolvedorRequestDto request) {
        Desenvolvedor desenvolvedor = new Desenvolvedor();
        desenvolvedor.setNome(request.getNome());
        desenvolvedor.setSenioridade(request.getSenioridade());
        desenvolvedor.setValorHoraCusto(request.getValorHoraCusto());
        desenvolvedor.setValorHoraExtra(request.getValorHoraExtra());

        if (request.getUsuarioId() != null) {
            Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com ID: " + request.getUsuarioId()));
            desenvolvedor.setUsuario(usuario);
        }

        return mapEntityToResponse(desenvolvedorRepository.save(desenvolvedor));
    }

    @Override
    @Transactional
    public DesenvolvedorResponseDto atualizarDesenvolvedor(Long id, DesenvolvedorRequestDto request) {
        Desenvolvedor desenvolvedor = desenvolvedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Desenvolvedor não encontrado com ID: " + id));

        desenvolvedor.setNome(request.getNome());
        desenvolvedor.setSenioridade(request.getSenioridade());
        desenvolvedor.setValorHoraCusto(request.getValorHoraCusto());
        desenvolvedor.setValorHoraExtra(request.getValorHoraExtra());

        if (request.getUsuarioId() != null) {
            Long usuarioAtualId = desenvolvedor.getUsuario() != null ? desenvolvedor.getUsuario().getId() : null;
            if (!request.getUsuarioId().equals(usuarioAtualId)) {
                Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                        .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
                desenvolvedor.setUsuario(usuario);
            }
        }



        return mapEntityToResponse(desenvolvedorRepository.save(desenvolvedor));
    }

    @Override
    public DesenvolvedorResponseDto buscarDesenvolvedor(Long id) {
        return mapEntityToResponse(desenvolvedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Desenvolvedor não encontrado")));
    }

    @Override
    public List<DesenvolvedorResponseDto> listarDesenvolvedores() {
        return desenvolvedorRepository.findAll().stream()
                .map(this::mapEntityToResponse)
                .toList();
    }

    @Override
    @Transactional
    public void deletarDesenvolvedor(Long id) {
        desenvolvedorRepository.delete(desenvolvedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Desenvolvedor não encontrado")));
    }

    private DesenvolvedorResponseDto mapEntityToResponse(Desenvolvedor desenvolvedor) {
        DesenvolvedorResponseDto response = new DesenvolvedorResponseDto();
        response.setId(desenvolvedor.getId());
        response.setNome(desenvolvedor.getNome());
        response.setSenioridade(desenvolvedor.getSenioridade());
        response.setValorHoraCusto(desenvolvedor.getValorHoraCusto());
        response.setValorHoraExtra(desenvolvedor.getValorHoraExtra());

        if (desenvolvedor.getUsuario() != null) {
            response.setUsuarioId(desenvolvedor.getUsuario().getId());
            response.setUsuarioEmail(desenvolvedor.getUsuario().getEmail());
        }



        return response;
    }

    private Long getEmpresaLogadaId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário logado não encontrado"));
        return usuario.getEmpresa().getId();
    }

    @Override
    public List<ProdutividadeDevDto> gerarRankingProdutividade() {
        Long empresaId = getEmpresaLogadaId();
        List<Object[]> resultados = desenvolvedorRepository.findProdutividadeRankingByEmpresaId(empresaId);

        return resultados.stream().map(row -> {
            ProdutividadeDevDto dto = new ProdutividadeDevDto();
            dto.setDesenvolvedorId(((Number) row[0]).longValue());
            dto.setNomeDesenvolvedor((String) row[1]);
            
            // Tratamento seguro para o Enum Senioridade
            Object senioridadeObj = row[2];
            if (senioridadeObj != null) {
                if (senioridadeObj instanceof Senioridade) {
                    dto.setSenioridade(((Senioridade) senioridadeObj).name());
                } else if (senioridadeObj instanceof String) {
                    dto.setSenioridade((String) senioridadeObj);
                } else if (senioridadeObj instanceof Integer) { // caso o JPA mapeie Enum como Ordinal
                    dto.setSenioridade(Senioridade.values()[(Integer) senioridadeObj].name());
                }
            }
            
            dto.setTotalHorasLancadas(((Number) row[3]).doubleValue());
            dto.setTotalHorasExtras(((Number) row[4]).doubleValue());
            Object custoObj = row[5];
            if (custoObj instanceof BigDecimal) {
                dto.setCustoTotalGerado((BigDecimal) custoObj);
            } else if (custoObj instanceof Number) {
                dto.setCustoTotalGerado(BigDecimal.valueOf(((Number) custoObj).doubleValue()));
            } else {
                dto.setCustoTotalGerado(BigDecimal.ZERO);
            }
            dto.setTotalSprintsParticipados(((Number) row[6]).longValue());
            return dto;
        }).collect(Collectors.toList());
    }
}
