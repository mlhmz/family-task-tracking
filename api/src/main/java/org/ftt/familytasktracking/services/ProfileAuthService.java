package org.ftt.familytasktracking.services;

import org.springframework.security.oauth2.jwt.Jwt;

import java.util.UUID;

public interface ProfileAuthService {
    UUID createSession(UUID profileUuid);

    boolean isProfilePasswordValid(UUID profileUuid, Jwt jwt, String password);

    void updateProfilePassword(UUID profileUuid, Jwt jwt, String rawPassword);

}
