package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.dtos.ProfileRequestDto;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.models.ProfileModel;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.UUID;

/**
 * Service for all {@link org.ftt.familytasktracking.entities.Profile}-related Processes
 */
public interface ProfileService {
    ProfileModel createProfile(ProfileModel model, Jwt jwt);

    ProfileModel updateProfile(ProfileModel updateModel, ProfileModel targetModel);

    List<ProfileModel> getAllProfilesByJwt(Jwt jwt);

    ProfileModel getProfileByUuidAndJwt(UUID profileUuid, Jwt jwt);

    boolean isProfilePasswordValid(UUID profileUuid, Jwt jwt, String password);

    void updateProfilePassword(UUID uuid, Jwt jwt, String rawPassword);

    void deleteProfileByUuid(UUID uuid, Jwt jwt);

    ProfileModel buildModelFromProfileEntity(Profile profile);

    ProfileModel buildModelFromProfileRequestDto(ProfileRequestDto dto);
}
