package org.ftt.familytasktracking.services;

import org.springframework.security.oauth2.jwt.Jwt;

import java.util.UUID;

public interface ProfileAuthService {
    boolean isProfilePasswordValid(UUID profileUuid, Jwt jwt, String password);

    void updateProfilePassword(UUID uuid, Jwt jwt, String rawPassword);
}
