package com.devflow.controller;

import com.devflow.dto.LoginRequestDto;
import com.devflow.dto.LoginResponseDto;
import com.devflow.dto.RegistroEmpresaRequestDto;
import com.devflow.model.Usuario;
import com.devflow.security.TokenService;
import com.devflow.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final AuthService authService;

    public AuthController(AuthenticationManager authenticationManager,
                          TokenService tokenService,
                          AuthService authService) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody @Valid LoginRequestDto data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.getEmail(), data.getSenha());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        var token = tokenService.gerarToken((Usuario) auth.getPrincipal());
        return ResponseEntity.ok(new LoginResponseDto(token));
    }

    @PostMapping("/registrar")
    public ResponseEntity<LoginResponseDto> registrar(
            @RequestBody @Valid RegistroEmpresaRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authService.registrarNovaEmpresa(request));
    }
}
