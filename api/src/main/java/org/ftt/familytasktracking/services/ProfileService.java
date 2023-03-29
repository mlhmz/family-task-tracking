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
    Profile createProfile(Profile profile, Jwt jwt);
    Profile updateProfile(Profile profile);
    List<Profile> getAllProfilesByJwt(Jwt jwt);
    Profile getProfileByUuidAndJwt(UUID profileUuid, Jwt jwt);
    boolean isProfilePasswordValid(UUID profileUuid, Jwt jwt, String password);
    void updateProfilePassword(UUID uuid, Jwt jwt, String rawPassword);
    void deleteProfileByUuid(UUID uuid, Jwt jwt);
}
