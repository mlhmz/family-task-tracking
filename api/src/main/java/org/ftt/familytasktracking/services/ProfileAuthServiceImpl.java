package org.ftt.familytasktracking.services;

import org.apache.commons.lang3.StringUtils;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.exceptions.WebRtException;
import org.ftt.familytasktracking.models.ProfileModel;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Implementation of the {@link ProfileAuthService}}
 */
@Service
public class ProfileAuthServiceImpl implements ProfileAuthService {
    private static final Map<UUID, UUID> sessions = new ConcurrentHashMap<>();
    private final ProfileService profileService;
    private final PasswordEncoder passwordEncoder;

    public ProfileAuthServiceImpl(ProfileService profileService, PasswordEncoder passwordEncoder) {
        this.profileService = profileService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public ProfileModel getProfileBySession(UUID sessionId, Jwt jwt) {
        return this.profileService.getProfileByUuidAndJwt(getProfileUuidFromSession(sessionId), jwt);
    }

    @Override
    public boolean isProfileSessionValid(UUID sessionId, Jwt jwt) {
        UUID profileUuid = getProfileUuidFromSession(sessionId);
        return this.profileService.existsByUuidAndJwt(profileUuid, jwt);
    }

    @Override
    public UUID createSession(UUID profileUuid) {
        UUID sessionUuid = UUID.randomUUID();
        sessions.put(sessionUuid, profileUuid);
        return sessionUuid;
    }

    @Override
    public boolean isProfilePasswordValid(UUID profileUuid, Jwt jwt, String password) {
        ProfileModel model = this.profileService.getProfileByUuidAndJwt(profileUuid, jwt);
        return StringUtils.isEmpty(model.toEntity().getPassword()) ||
                passwordEncoder.matches(password, model.toEntity().getPassword());
    }

    @Override
    public void updateProfilePassword(UUID profileUuid, Jwt jwt, String rawPassword) {
        ProfileModel targetModel = this.profileService.getProfileByUuidAndJwt(profileUuid, jwt);
        ProfileModel updatedModel = this.getProfileWithChangedPassword(targetModel, rawPassword);
        this.profileService.updateProfile(updatedModel, targetModel, true);
    }

    private UUID getProfileUuidFromSession(UUID sessionId) {
        if (sessions.containsKey(sessionId)) {
            return sessions.get(sessionId);
        } else {
            throw new WebRtException(HttpStatus.UNAUTHORIZED, "The session was not found");
        }
    }

    private ProfileModel getProfileWithChangedPassword(ProfileModel model, String rawPassword) {
        Profile updatedProfile = model.toEntity();
        updatedProfile.setPassword(
                passwordEncoder.encode(rawPassword)
        );
        return this.profileService.buildModelFromProfileEntity(updatedProfile);
    }
}
