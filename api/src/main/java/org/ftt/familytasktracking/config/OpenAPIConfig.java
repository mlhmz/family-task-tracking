package org.ftt.familytasktracking.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import jakarta.servlet.ServletContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {
    public static final String SECURITY_SCHEME_NAME = "bearerAuth";
    public static final String API_TITLE = "Family Task Tracking";
    public static final String API_DESCRIPTION = "Documentation for the Family Task Tracking API<br>" +
            "Admin Routes are Routes that only privileged Profiles can use.<br>" +
            "<b>IMPORTANT:</b> When no Household with a privileged Profile is bound to a Keycloak User, " +
            "the Keycloak User is able to Create a Household and a privileged Profile without an actual " +
            "selected Profile";
    private final ServletContext context;

    public OpenAPIConfig(ServletContext context) {
        this.context = context;
    }

    @Bean
    public OpenAPI getOpenAPI() {
        return new OpenAPI()
                .addServersItem(new Server().url(this.context.getContextPath()))
                .info(new Info()
                        .title(API_TITLE)
                        .description(API_DESCRIPTION)
                        .version("1")
                )
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(
                        new Components()
                                .addSecuritySchemes(SECURITY_SCHEME_NAME,
                                        new SecurityScheme()
                                                .name(SECURITY_SCHEME_NAME)
                                                .type(SecurityScheme.Type.HTTP)
                                                .scheme("bearer")
                                                .bearerFormat("JWT")
                                )
                );
    }
}
