package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.dtos.ProfileRequestDto;
import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.exceptions.WebRtException;
import org.ftt.familytasktracking.mappers.ProfileMapper;
import org.ftt.familytasktracking.models.ProfileModel;
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

    private ProfileServiceImpl(ProfileRepository profileRepository, ProfileMapper mapper,
                               KeycloakService keycloakService, HouseholdService householdService,
                               PasswordEncoder passwordEncoder) {
        this.profileRepository = profileRepository;
        this.profileMapper = mapper;
        this.keycloakService = keycloakService;
        this.householdService = householdService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<ProfileModel> getAllProfilesByJwt(Jwt jwt) {
        UUID keycloakUserId = this.keycloakService.getKeycloakUserId(jwt);
        return this.profileRepository
                .findAllByKeycloakUserId(keycloakUserId)
                .stream()
                .map(this::buildModelFromProfileEntity)
                .toList();
    }

    @Override
    public ProfileModel getProfileByUuidAndJwt(UUID profileUuid, Jwt jwt) {
        UUID keycloakUserId = this.keycloakService.getKeycloakUserId(jwt);
        Profile profile = this.profileRepository.findByKeycloakUserIdAndUuid(keycloakUserId, profileUuid)
                .orElseThrow(getProfileNotFoundWebRtExceptionSupplier(profileUuid));
        return buildModelFromProfileEntity(profile);
    }

    @Override
    public boolean isProfilePasswordValid(UUID profileUuid, Jwt jwt, String password) {
        ProfileModel model = getProfileByUuidAndJwt(profileUuid, jwt);
        return passwordEncoder.matches(password, model.toEntity().getPassword());
    }

    @Override
    public ProfileModel createProfile(ProfileModel model, Jwt jwt) {
        Profile profile = model.toEntity();
        Household household = this.householdService.getHouseholdByJwt(jwt)
                .orElseThrow(() -> new WebRtException(HttpStatus.BAD_REQUEST,
                        "Couldn't create the profile because the user has no household"));
        profile.setHousehold(household);
        return this.buildModelFromProfileEntity(saveProfile(model.toEntity()));
    }

    @Override
    public ProfileModel updateProfile(ProfileModel model) {
        return this.buildModelFromProfileEntity(this.saveProfile(model.toEntity()));
    }

    private Profile saveProfile(Profile profile) {
        return this.profileRepository.save(profile);
    }

    @Override
    public void updateProfilePassword(UUID uuid, Jwt jwt, String rawPassword) {
        Profile profile = this.getProfileByUuidAndJwt(uuid, jwt).toEntity();
        this.savePasswordToProfile(profile, rawPassword);
        this.saveProfile(profile);
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

    @Override
    public ProfileModel buildModelFromProfileEntity(Profile profile) {
        return new ProfileModel(profile, profileMapper);
    }

    @Override
    public ProfileModel buildModelFromProfileRequestDto(ProfileRequestDto dto) {
        return new ProfileModel(dto, profileMapper);
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
