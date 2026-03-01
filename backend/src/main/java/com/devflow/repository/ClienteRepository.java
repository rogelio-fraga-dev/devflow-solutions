package com.devflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.devflow.model.Cliente;
import java.util.List;
import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByCnpj(
        String cnpj
    );
    
    List<Cliente> findByRazaoSocialContainingIgnoreCase(
        String razaoSocial
    );

    List<Cliente> findByPessoaContatoContainingIgnoreCase(
        String pessoaContato
    );

}
