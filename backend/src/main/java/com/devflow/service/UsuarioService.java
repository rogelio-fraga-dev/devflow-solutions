package com.devflow.service;

import java.util.List;
import com.devflow.dto.UsuarioRequestDto;
import com.devflow.dto.UsuarioResponseDto;

public interface UsuarioService {
     UsuarioResponseDto criarUsuario(UsuarioRequestDto request);
     List<UsuarioResponseDto> listarUsuarios();
     UsuarioResponseDto buscarUsuario(Long id);
     UsuarioResponseDto atualizarUsuario(Long id, UsuarioRequestDto request);
     void deletarUsuario(Long id);
}