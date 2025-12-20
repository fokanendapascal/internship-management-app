package com.techsolution.ima_backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {

        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("IMA Backend API")
                        .version("1.0")
                        .description("Documentation de l'API IMA Backend")
                        .contact(new Contact()
                                .name("Tech Solution")
                                .email("support@techsolution.com")
                        )
                )

                // Ajout du bouton Authorize() dans Swagger
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))

                // Définition du schéma de sécurité JWT
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Entrez le token JWT sous la forme : Bearer <token>")
                        )
                );
    }
}
