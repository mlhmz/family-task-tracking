package org.ftt.familytasktracking.services;

import org.apache.commons.lang3.StringUtils;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.models.ProfileModel;
import org.ftt.familytasktracking.session.UserSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Implementation of the {@link ProfileAuthService}}
 */
@Service
public class ProfileAuthServiceImpl implements ProfileAuthService {
    private final ProfileService profileService;
    private final PasswordEncoder passwordEncoder;
    private final UserSessionService userSessionService;

    public ProfileAuthServiceImpl(ProfileService profileService, PasswordEncoder passwordEncoder,
                                  UserSessionService userSessionService) {
        this.profileService = profileService;
        this.passwordEncoder = passwordEncoder;
        this.userSessionService = userSessionService;
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
    public UserSession createSession(UUID profileUuid) {
        return this.userSessionService.storeSession(profileUuid);
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
        return this.userSessionService.getSession(sessionId).profileId();
    }

    private ProfileModel getProfileWithChangedPassword(ProfileModel model, String rawPassword) {
        Profile updatedProfile = model.toEntity();
        updatedProfile.setPassword(
                passwordEncoder.encode(rawPassword)
        );
        return this.profileService.buildModelFromProfileEntity(updatedProfile);
    }
}
