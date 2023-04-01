package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.models.ProfileModel;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.UUID;

/**
 * Interface for the ProfileAuthService.
 * <p>
 * The service addresses all profile authentication processes like Creating a Session,
 * getting a Session by the profile, checking if the session is valid, or changing the profiles
 * password
 */
public interface ProfileAuthService {
    ProfileModel getProfileBySession(UUID sessionId, Jwt jwt);

    UUID createSession(UUID profileUuid);

    boolean isProfilePasswordValid(UUID profileUuid, Jwt jwt, String password);

    boolean isProfileSessionValid(UUID sessionId, Jwt jwt);

    void updateProfilePassword(UUID profileUuid, Jwt jwt, String rawPassword);

}
