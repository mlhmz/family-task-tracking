package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.dtos.ProfileRequestDto;
import org.ftt.familytasktracking.dtos.ProfileResponseDto;
import org.ftt.familytasktracking.entities.Profile;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.UUID;

/**
 * Service for all {@link org.ftt.familytasktracking.entities.Profile}-related Processes
 */
public interface ProfileService {
    List<ProfileResponseDto> getAllProfileResponsesByJwt(Jwt jwt);

    List<Profile> getAllProfilesByJwt(Jwt jwt);

    ProfileResponseDto getProfileResponseByUuidAndJwt(UUID profileUuid, Jwt jwt);

    Profile getProfileByUuidAndJwt(UUID profileUuid, Jwt jwt);

    boolean isProfilePasswordValid(UUID profileUuid, Jwt jwt, String password);

    ProfileResponseDto createProfile(ProfileRequestDto dto, Jwt jwt);
    ProfileResponseDto updateProfile(UUID uuid, ProfileRequestDto dto, Jwt jwt);

    void updateProfilePassword(UUID uuid, Jwt jwt, String rawPassword);

    void deleteProfileByUuid(UUID uuid, Jwt jwt);
}
