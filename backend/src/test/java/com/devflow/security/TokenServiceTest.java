package com.devflow.security;

import com.devflow.model.Role;
import com.devflow.model.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class TokenServiceTest {

    private TokenService tokenService;

    @BeforeEach
    void setUp() {
        tokenService = new TokenService();
        // Injetando o secret manually pois não há container Spring puro aqui
        ReflectionTestUtils.setField(tokenService, "secret", "my-test-secret-key-12345");
    }

    @Test
    void deveGerarTokenDescriptografavelComSucesso() {
        // Arrange
        Usuario usuario = new Usuario();
        usuario.setEmail("ceo@devflow.com");
        usuario.setRole(Role.ADMIN);

        // Act
        String token = tokenService.gerarToken(usuario);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());

        // Validando Decriptografia Front/Back
        String emailDecoded = tokenService.extrairEmailDoToken(token);
        assertEquals("ceo@devflow.com", emailDecoded);
    }

    @Test
    void deveMandarVazioParaTokenForjado() {
        // Arrange
        String forgedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC.fake.fake";

        // Act
        String email = tokenService.extrairEmailDoToken(forgedToken);

        // Assert (Filtro barrará)
        assertEquals("", email);
    }
}
