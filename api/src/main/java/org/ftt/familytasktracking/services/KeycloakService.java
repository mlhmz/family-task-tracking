package org.ftt.familytasktracking.services;

import org.springframework.security.oauth2.jwt.Jwt;

import java.util.UUID;

/**
 * Service-Interface for all Keycloak Processes
 */
public interface KeycloakService {
    boolean isJwtSubjectContainingUUID(Jwt token);

    UUID getKeycloakUserId(Jwt token);
}
