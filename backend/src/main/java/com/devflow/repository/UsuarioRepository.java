package com.devflow.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.devflow.model.Usuario;
import com.devflow.model.Role;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    List<Usuario> findByRole (
        Role role
    );
    Optional<Usuario> findByEmailIgnoreCase (
        String email
    );
}
