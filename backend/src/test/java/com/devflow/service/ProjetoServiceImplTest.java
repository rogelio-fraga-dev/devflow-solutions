package com.devflow.service;

import com.devflow.dto.ProjetoResponseDto;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.model.Empresa;
import com.devflow.model.Projeto;
import com.devflow.model.Usuario;
import com.devflow.repository.ClienteRepository;
import com.devflow.repository.DesenvolvedorRepository;
import com.devflow.repository.ProjetoRepository;
import com.devflow.repository.UsuarioRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Foco: isolamento multi-tenant. Garante que um usuário de uma empresa não
 * consegue ler, alterar ou excluir projetos de outra empresa (proteção contra IDOR).
 */
class ProjetoServiceImplTest {

    private static final String EMAIL_LOGADO = "gestor@empresaA.com";
    private static final Long EMPRESA_LOGADA = 10L;
    private static final Long OUTRA_EMPRESA = 99L;

    @Mock private ProjetoRepository projetoRepository;
    @Mock private ClienteRepository clienteRepository;
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private DesenvolvedorRepository desenvolvedorRepository;

    @InjectMocks private ProjetoServiceImpl service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(EMAIL_LOGADO, null));

        Usuario logado = new Usuario();
        logado.setEmail(EMAIL_LOGADO);
        logado.setEmpresa(empresa(EMPRESA_LOGADA));
        lenient().when(usuarioRepository.findByEmailIgnoreCase(EMAIL_LOGADO))
                .thenReturn(Optional.of(logado));
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("buscarProjeto retorna o projeto quando pertence à empresa do usuário")
    void buscarProjeto_mesmaEmpresa_retornaDto() {
        when(projetoRepository.findById(1L)).thenReturn(Optional.of(projeto(1L, EMPRESA_LOGADA)));

        ProjetoResponseDto dto = service.buscarProjeto(1L);

        assertNotNull(dto);
        assertEquals(1L, dto.getId());
    }

    @Test
    @DisplayName("buscarProjeto de outra empresa lança 404 (não vaza existência)")
    void buscarProjeto_outraEmpresa_lanca404() {
        when(projetoRepository.findById(2L)).thenReturn(Optional.of(projeto(2L, OUTRA_EMPRESA)));

        assertThrows(ResourceNotFoundException.class, () -> service.buscarProjeto(2L));
    }

    @Test
    @DisplayName("deletarProjeto de outra empresa lança 404 e nunca chama delete")
    void deletarProjeto_outraEmpresa_naoDeleta() {
        when(projetoRepository.findById(3L)).thenReturn(Optional.of(projeto(3L, OUTRA_EMPRESA)));

        assertThrows(ResourceNotFoundException.class, () -> service.deletarProjeto(3L));
        verify(projetoRepository, never()).delete(any());
    }

    @Test
    @DisplayName("buscarProjeto inexistente lança 404")
    void buscarProjeto_inexistente_lanca404() {
        when(projetoRepository.findById(404L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.buscarProjeto(404L));
    }

    // --- helpers ---
    private Empresa empresa(Long id) {
        Empresa e = new Empresa();
        e.setId(id);
        return e;
    }

    private Projeto projeto(Long id, Long empresaId) {
        Projeto p = new Projeto();
        p.setId(id);
        p.setNome("Projeto " + id);
        p.setBudgetTotal(new BigDecimal("100000.00"));
        p.setEmpresa(empresa(empresaId));
        return p;
    }
}
