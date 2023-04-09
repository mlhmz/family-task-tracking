package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.models.ProfileModel;
import org.ftt.familytasktracking.session.UserSession;
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
    /**
     * Gets a Profile by the Session ID
     *
     * @param sessionId Session ID of the Profile
     * @param jwt       {@link Jwt} of the Profiles Keycloak User and the
     *                  {@link org.ftt.familytasktracking.entities.Household}
     * @return {@link ProfileModel} that represents the Profile Entity
     */
    ProfileModel getProfileBySession(UUID sessionId, Jwt jwt);

    /**
     * Creates a new Session by the {@link UUID} of the {@link org.ftt.familytasktracking.entities.Profile}
     *
     * @param profileUuid {@link UUID} of the Profile
     * @return Session ID as {@link UUID}
     */
    UserSession createSession(UUID profileUuid);

    /**
     * Checks if the Password of the {@link org.ftt.familytasktracking.entities.Profile} is valid
     *
     * @param profileUuid {@link UUID} of the Profile
     * @param jwt         {@link Jwt} of the Profiles Keycloak User and the
     *                    {@link org.ftt.familytasktracking.entities.Household}
     * @param password    Raw Password of the {@link org.ftt.familytasktracking.entities.Profile} as String
     * @return boolean if the Password of the Profile is valid
     */
    boolean isProfilePasswordValid(UUID profileUuid, Jwt jwt, String password);

    /**
     * Checks if a Session is valid
     *
     * @param sessionId Session ID of the Session
     * @param jwt       {@link Jwt} of the Profiles Household
     * @return boolean if the Session is valid
     */
    boolean isProfileSessionValid(UUID sessionId, Jwt jwt);

    /**
     * Updates the Password of the Profile
     *
     * @param profileUuid {@link org.ftt.familytasktracking.entities.Profile} that password should be updated
     * @param jwt         {@link Jwt} that the Profiles Household is bound to
     * @param rawPassword The raw password as string that should be hashed and updated
     */
    void updateProfilePassword(UUID profileUuid, Jwt jwt, String rawPassword);

}
