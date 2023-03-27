package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.dtos.ProfileRequestDto;
import org.ftt.familytasktracking.dtos.ProfileResponseDto;
import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.exceptions.WebRtException;
import org.ftt.familytasktracking.mappers.ProfileMapper;
import org.ftt.familytasktracking.repositories.ProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;

/**
 * Service for all Profile related Processes
 */
@Service
public class ProfileServiceImpl implements ProfileService {
    private final ProfileRepository profileRepository;
    private final ProfileMapper profileMapper;
    private final KeycloakService keycloakService;
    private final HouseholdService householdService;
    private final PasswordEncoder passwordEncoder;

    private ProfileServiceImpl(ProfileRepository profileRepository, ProfileMapper profileMapper,
                               KeycloakService keycloakService, HouseholdService householdService,
                               PasswordEncoder passwordEncoder) {
        this.profileRepository = profileRepository;
        this.profileMapper = profileMapper;
        this.keycloakService = keycloakService;
        this.householdService = householdService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<ProfileResponseDto> getAllProfileResponsesByJwt(Jwt jwt) {
        return getAllProfilesByJwt(jwt)
                .stream()
                .map(profileMapper::mapProfileToProfileDto)
                .toList();
    }

    @Override
    public List<Profile> getAllProfilesByJwt(Jwt jwt) {
        UUID keycloakUserId = this.keycloakService.getKeycloakUserId(jwt);
        return this.profileRepository.findAllByKeycloakUserId(
                keycloakUserId
        );
    }

    @Override
    public ProfileResponseDto getProfileResponseByUuidAndJwt(UUID profileUuid, Jwt jwt) {
        Profile profile = getProfileByUuidAndJwt(profileUuid, jwt);
        return this.profileMapper.mapProfileToProfileDto(profile);
    }

    @Override
    public Profile getProfileByUuidAndJwt(UUID profileUuid, Jwt jwt) {
        UUID keycloakUserId = this.keycloakService.getKeycloakUserId(jwt);
        return this.profileRepository.findByKeycloakUserIdAndUuid(keycloakUserId, profileUuid)
                .orElseThrow(getProfileNotFoundWebRtExceptionSupplier(profileUuid));
    }

    @Override
    public boolean isProfilePasswordValid(UUID profileUuid, Jwt jwt, String password) {
        Profile profile = getProfileByUuidAndJwt(profileUuid, jwt);
        return passwordEncoder.matches(password, profile.getPassword());
    }

    @Override
    public ProfileResponseDto createProfile(ProfileRequestDto dto, Jwt jwt) {
        Profile profile = this.profileMapper.mapProfileDtoToProfile(dto);
        Household household = this.householdService.getHouseholdByJwt(jwt)
                .orElseThrow(() -> new WebRtException(HttpStatus.BAD_REQUEST,
                        "Couldn't create the profile because the user has no household"));
        profile.setHousehold(household);
        return this.profileMapper.mapProfileToProfileDto(this.profileRepository.save(profile));
    }

    @Override
    public ProfileResponseDto updateProfile(UUID uuid, ProfileRequestDto dto, Jwt jwt) {
        Profile profile = this.getProfileByUuidAndJwt(uuid, jwt);
        this.profileMapper.updateProfileFromDto(dto, profile);
        return this.profileMapper.mapProfileToProfileDto(profile);
    }

    @Override
    public void updateProfilePassword(UUID uuid, Jwt jwt, String rawPassword) {
        Profile profile = this.getProfileByUuidAndJwt(uuid, jwt);
        this.savePasswordToProfile(profile, rawPassword);
    }

    private void savePasswordToProfile(Profile profile, String rawPassword) {
        profile.setPassword(
                passwordEncoder.encode(rawPassword)
        );
    }

    @Override
    public void deleteProfileByUuid(UUID uuid, Jwt jwt) {
        UUID keycloakUserId = this.keycloakService.getKeycloakUserId(jwt);
        if (!this.profileRepository.existsByKeycloakUserIdAndUuid(keycloakUserId, uuid)) {
            this.throwProfileNotFoundWebRtException(uuid);
        }
        this.profileRepository.deleteById(uuid);
    }

    private void throwProfileNotFoundWebRtException(UUID uuid) {
        throw getProfileNotFoundWebRtException(uuid);
    }

    private Supplier<WebRtException> getProfileNotFoundWebRtExceptionSupplier(UUID uuid) {
        return () -> getProfileNotFoundWebRtException(uuid);
    }

    private WebRtException getProfileNotFoundWebRtException(UUID uuid) {
        return new WebRtException(
                HttpStatus.NOT_FOUND, String.format("The profile with the uuid '%s' couldn't be found.", uuid)
        );
    }
}
