package com.devflow.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.devflow.dto.DesenvolvedorRequestDto;
import com.devflow.dto.DesenvolvedorResponseDto;
import com.devflow.model.Desenvolvedor;
import com.devflow.model.Projeto;
import com.devflow.model.Usuario;
import com.devflow.repository.DesenvolvedorRepository;
import com.devflow.repository.ProjetoRepository;
import com.devflow.repository.UsuarioRepository;

@Service
public class DesenvolvedorServiceImpl implements DesenvolvedorService {

    private final DesenvolvedorRepository desenvolvedorRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProjetoRepository projetoRepository;

    
    public DesenvolvedorServiceImpl(
        DesenvolvedorRepository desenvolvedorRepository
        , UsuarioRepository usuarioRepository
        , ProjetoRepository projetoRepository
)   {        
        this.usuarioRepository = usuarioRepository;
        this.projetoRepository = projetoRepository;
        this.desenvolvedorRepository = desenvolvedorRepository;
    }
    @Override
    public DesenvolvedorResponseDto criarDesenvolvedor(DesenvolvedorRequestDto request) {
        Desenvolvedor desenvolvedor = mapRequestToEntity(request);
        Desenvolvedor savedDesenvolvedor = desenvolvedorRepository.save(desenvolvedor);
        return mapEntityToResponse(savedDesenvolvedor);
    }
    @Override
    public List<DesenvolvedorResponseDto> listarDesenvolvedores() {
        List<Desenvolvedor> desenvolvedores = desenvolvedorRepository.findAll();
        return desenvolvedores.stream()
            .map(this::mapEntityToResponse)
            .toList();
    }
    @Override
    public DesenvolvedorResponseDto buscarDesenvolvedor(Long id) {
        Desenvolvedor desenvolvedor = desenvolvedorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Desenvolvedor nao encontrado"));
        return mapEntityToResponse(desenvolvedor);
    }

    private Desenvolvedor mapRequestToEntity(DesenvolvedorRequestDto request) {
        Desenvolvedor desenvolvedor = new Desenvolvedor();
        desenvolvedor.setNome(request.getNome());
        desenvolvedor.setSenioridade(request.getSenioridade());
        desenvolvedor.setValorHoraCusto(request.getValorHoraCusto());
        desenvolvedor.setValorHoraExtra(request.getValorHoraExtra());
        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
        .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));        
        desenvolvedor.setUsuario(usuario);
        Projeto projeto = projetoRepository.findById(request.getProjetoId())
        .orElseThrow(() -> new RuntimeException("Projeto nao encontrado"));
        desenvolvedor.setProjeto(projeto);
        return desenvolvedor;
    }        
    private DesenvolvedorResponseDto mapEntityToResponse(Desenvolvedor desenvolvedor) {
        DesenvolvedorResponseDto response = new DesenvolvedorResponseDto();
        response.setId(desenvolvedor.getId());
        response.setNome(desenvolvedor.getNome());
        response.setSenioridade(desenvolvedor.getSenioridade());
        response.setValorHoraCusto(desenvolvedor.getValorHoraCusto());
        response.setValorHoraExtra(desenvolvedor.getValorHoraExtra());
        response.setUsuarioId(desenvolvedor.getUsuario().getId());
        response.setProjetoId(desenvolvedor.getProjeto().getId());
        return response;        
    }
    @Override
    public DesenvolvedorResponseDto atualizarDesenvolvedor(Long id, DesenvolvedorRequestDto request) {
        Desenvolvedor desenvolvedor = mapRequestToEntity(request);
        desenvolvedor.setId(id);
        Desenvolvedor desenvolvedorAtualizado = desenvolvedorRepository.save(desenvolvedor);
        return mapEntityToResponse(desenvolvedorAtualizado);
    }
    @Override
    public void deletarDesenvolvedor(Long id) {
        desenvolvedorRepository.deleteById(id);
    }

}

