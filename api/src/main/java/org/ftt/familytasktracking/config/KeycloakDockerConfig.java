package org.ftt.familytasktracking.config;

import org.keycloak.adapters.springboot.KeycloakSpringBootProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

@Profile(value = {"docker"})
@Configuration
public class KeycloakDockerConfig {
    @Bean
    @Primary
    public KeycloakSpringBootProperties getKeycloakSpringBootProperties() {
        KeycloakSpringBootProperties props = new KeycloakSpringBootProperties();
        props.setRealm(System.getenv("KC_REALM"));
        props.setResource(System.getenv("KC_RESOURCE"));
        props.setAuthServerUrl("http://" + System.getenv("KC_URL") + ":" + getKeycloakPort());
        props.setPublicClient(true);
        props.setSslRequired("external");
        props.setBearerOnly(true);
        return props;

    }

    private String getKeycloakPort() {
        String dbPort = System.getenv("KC_PORT");
        if (dbPort == null) {
            return "8080";
        }
        return dbPort;
    }
}
