package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.models.ProfileModel;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ProfileAuthServiceImpl implements ProfileAuthService {
    private final ProfileService profileService;
    private final PasswordEncoder passwordEncoder;

    public ProfileAuthServiceImpl(ProfileService profileService, PasswordEncoder passwordEncoder) {
        this.profileService = profileService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public boolean isProfilePasswordValid(UUID profileUuid, Jwt jwt, String password) {
        ProfileModel model = this.profileService.getProfileByUuidAndJwt(profileUuid, jwt);
        return passwordEncoder.matches(password, model.toEntity().getPassword());
    }

    @Override
    public void updateProfilePassword(UUID uuid, Jwt jwt, String rawPassword) {
        ProfileModel targetModel = this.profileService.getProfileByUuidAndJwt(uuid, jwt);
        ProfileModel updatedModel = this.getProfileWithChangedPassword(targetModel, rawPassword);
        this.profileService.updateProfile(updatedModel, targetModel);
    }

    private ProfileModel getProfileWithChangedPassword(ProfileModel model, String rawPassword) {
        Profile updatedProfile = model.toEntity();
        updatedProfile.setPassword(
                passwordEncoder.encode(rawPassword)
        );
        return this.profileService.buildModelFromProfileEntity(updatedProfile);
    }
}
