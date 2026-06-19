package com.devflow.security;

import com.devflow.model.Usuario;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
public class TokenService {

    // Fonte única do segredo: definido em application.properties
    // (que por sua vez aceita override via env API_SECURITY_TOKEN_SECRET).
    @Value("${api.security.token.secret}")
    private String secret;

    public String gerarToken(Usuario usuario) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer("devflow-auth-api")
                    .withSubject(usuario.getEmail())
                    .withClaim("role", usuario.getRole().name())
                    .withClaim("nome", usuario.getNome())
                    .withClaim("empresa", usuario.getEmpresa() != null ? usuario.getEmpresa().getNomeFantasia() : "DevFlow Solutions")
                    .withExpiresAt(gerarDataExpiracao())
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro enquanto gerava token", exception);
        }
    }

    public String extrairEmailDoToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("devflow-auth-api")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            return "";
        }
    }

    private Instant gerarDataExpiracao() {
        return LocalDateTime.now(ZoneId.systemDefault())
                .plusHours(24)
                .atZone(ZoneId.systemDefault())
                .toInstant();
    }
}
