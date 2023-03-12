package org.ftt.familytasktracking.config;

import org.apache.commons.lang3.StringUtils;
import org.keycloak.adapters.springboot.KeycloakSpringBootProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

/**
 * Custom Keycloak Configuration Class that works with environment variables instead of a properties file.
 */
@Profile(value = {"docker"})
@Configuration
public class KeycloakDockerConfig {
    /**
     * Gets the keycloak properties with the environment variables from docker.
     * Gets injected as {@link Bean} overwrites existing properties with the
     * {@link Primary} annotation
     *
     * @return {@link KeycloakSpringBootProperties}
     */
    @Bean
    @Primary
    public KeycloakSpringBootProperties getKeycloakSpringBootProperties() {
        KeycloakSpringBootProperties props = new KeycloakSpringBootProperties();
        props.setRealm(System.getenv("KC_REALM"));
        props.setResource(System.getenv("KC_RESOURCE"));
        props.setAuthServerUrl("http://" + System.getenv("KC_URL") + ":" + getKeycloakPort());
        setRealmKeyIfExists(props);
        props.setPublicClient(true);
        props.setSslRequired("external");
        props.setBearerOnly(true);
        return props;

    }

    /**
     * Optionally sets the Keycloak Realm Key if it exists in the environment variables.
     * This is required when the keycloak url mismatches from the issuer and the spring service (api).
     * <p>
     * As example, when the spring service and keycloak service are running in containers and are connected
     * per docker networking.
     * <p>
     * This will result in the issuer requesting the keycloak service with a different URL than the spring service.
     *
     * @param props {@link KeycloakSpringBootProperties} to modify
     */
    private void setRealmKeyIfExists(KeycloakSpringBootProperties props) {
        String realmKey = System.getenv("KC_REALM_KEY");
        if (StringUtils.isNotEmpty(realmKey)) {
            props.setRealmKey(realmKey);
        }
    }

    /**
     * Gets the keycloak port from the docker env, when no one is formulated, it will be set to 8080
     *
     * @return port as string
     */
    private String getKeycloakPort() {
        String dbPort = System.getenv("KC_PORT");
        if (StringUtils.isEmpty(dbPort)) {
            return "8080";
        }
        return dbPort;
    }
}
