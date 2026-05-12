package com.devflow.service;

import com.devflow.dto.LoginResponseDto;
import com.devflow.dto.RegistroEmpresaRequestDto;
import com.devflow.model.Empresa;
import com.devflow.model.Role;
import com.devflow.model.Usuario;
import com.devflow.repository.EmpresaRepository;
import com.devflow.repository.UsuarioRepository;
import com.devflow.security.TokenService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final EmpresaRepository empresaRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthServiceImpl(EmpresaRepository empresaRepository,
                           UsuarioRepository usuarioRepository,
                           PasswordEncoder passwordEncoder,
                           TokenService tokenService) {
        this.empresaRepository = empresaRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @Override
    @Transactional
    public LoginResponseDto registrarNovaEmpresa(RegistroEmpresaRequestDto request) {

        // Regra: CNPJ único — evita registros duplicados da mesma empresa
        if (empresaRepository.existsByCnpj(request.getCnpj())) {
            throw new IllegalArgumentException("Já existe uma empresa registrada com este CNPJ.");
        }

        // Regra: e-mail do admin único no sistema
        if (usuarioRepository.findByEmailIgnoreCase(request.getEmailAdmin()).isPresent()) {
            throw new IllegalArgumentException("Este e-mail já está em uso no sistema.");
        }

        // 1. Criar e persistir a Empresa
        Empresa empresa = new Empresa();
        empresa.setNomeFantasia(request.getNomeFantasia());
        empresa.setCnpj(request.getCnpj());
        empresa = empresaRepository.save(empresa);

        // 2. Criar o primeiro usuário com role ADMIN vinculado à Empresa
        Usuario admin = new Usuario();
        admin.setNome(request.getNomeAdmin());
        admin.setEmail(request.getEmailAdmin());
        admin.setSenha(passwordEncoder.encode(request.getSenhaAdmin()));
        admin.setRole(Role.ADMIN);
        admin.setAtivo(true);
        admin.setEmpresa(empresa);
        admin = usuarioRepository.save(admin);

        // 3. Gerar e retornar o token JWT para o admin já poder operar imediatamente
        String token = tokenService.gerarToken(admin);
        return new LoginResponseDto(token);
    }
}
