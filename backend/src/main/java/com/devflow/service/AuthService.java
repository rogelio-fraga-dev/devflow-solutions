package com.devflow.service;

import com.devflow.dto.LoginResponseDto;
import com.devflow.dto.RegistroEmpresaRequestDto;

public interface AuthService {
    LoginResponseDto registrarNovaEmpresa(RegistroEmpresaRequestDto request);
}
