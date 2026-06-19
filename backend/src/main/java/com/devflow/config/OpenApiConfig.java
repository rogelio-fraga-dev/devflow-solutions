package com.devflow.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Metadados da documentação OpenAPI/Swagger.
 * UI disponível em /swagger-ui.html · spec em /v3/api-docs.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI devflowOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("DevFlow Solutions API")
                .description("API REST de gestão financeira de projetos — multi-tenant, autenticação JWT. Endpoints sob /api/v1.")
                .version("v1")
                .contact(new Contact().name("Equipe DevFlow Solutions")));
    }
}
