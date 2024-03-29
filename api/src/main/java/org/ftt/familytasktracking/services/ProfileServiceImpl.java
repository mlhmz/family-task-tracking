package org.ftt.familytasktracking.services;

import com.querydsl.core.types.dsl.BooleanExpression;
import lombok.NonNull;
import org.ftt.familytasktracking.dtos.ProfileRequestDto;
import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.entities.QProfile;
import org.ftt.familytasktracking.enums.PermissionType;
import org.ftt.familytasktracking.exceptions.WebRtException;
import org.ftt.familytasktracking.mappers.ProfileMapper;
import org.ftt.familytasktracking.models.ProfileModel;
import org.ftt.familytasktracking.predicate.PredicatesBuilder;
import org.ftt.familytasktracking.repositories.ProfileRepository;
import org.ftt.familytasktracking.search.SearchQuery;
import org.ftt.familytasktracking.utils.SearchQueryUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;
import java.util.stream.StreamSupport;

/**
 * Service for all Profile related Processes
 */
@Service
public class ProfileServiceImpl implements ProfileService {
    private final ProfileRepository profileRepository;
    private final ProfileMapper profileMapper;
    private final KeycloakService keycloakService;
    private final HouseholdService householdService;

    public ProfileServiceImpl(ProfileRepository profileRepository, ProfileMapper mapper,
                              KeycloakService keycloakService, HouseholdService householdService) {
        this.profileRepository = profileRepository;
        this.profileMapper = mapper;
        this.keycloakService = keycloakService;
        this.householdService = householdService;
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
    public List<ProfileModel> getAllProfilesByJwtAndSearchQuery(@NonNull Jwt jwt, @NonNull String query) {
        Household household = this.householdService.getHouseholdByJwt(jwt);
        PredicatesBuilder<Profile> predicatesBuilder = new PredicatesBuilder<>(Profile.class);

        List<SearchQuery> searchQueries = SearchQueryUtils.parseSearchQueries(query, Profile.class);

        searchQueries.forEach(predicatesBuilder::with);

        BooleanExpression exp = predicatesBuilder.build();
        QProfile profile = QProfile.profile;
        Iterable<Profile> profiles;
        try {
            profiles = this.profileRepository.findAll(profile.household.eq(household).and(exp));
        } catch (Exception exception) {
            throw new WebRtException(HttpStatus.BAD_REQUEST, "Query Error: " + exception.getMessage());
        }
        return StreamSupport.stream(profiles.spliterator(), false)
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
    public ProfileModel createProfile(ProfileModel model, Jwt jwt) {
        Profile profile = model.toEntity();
        Household household = this.householdService.getHouseholdByJwt(jwt);
        profile.setHousehold(household);
        return this.buildModelFromProfileEntity(saveProfile(model.toEntity()));
    }

    @Override
    public ProfileModel updateProfile(ProfileModel updateModel, ProfileModel targetModel, boolean safe) {
        if (safe) {
            this.profileMapper.safeUpdateProfileFromDto(updateModel.toEntity(), targetModel.toEntity());
        } else {
            this.profileMapper.updateProfileFromDto(updateModel.toEntity(), targetModel.toEntity());
        }
        return this.buildModelFromProfileEntity(this.saveProfile(targetModel.toEntity()));
    }

    private Profile saveProfile(Profile profile) {
        return this.profileRepository.save(profile);
    }

    @Override
    public void deleteProfileByUuid(UUID uuid, Jwt jwt) {
        if (!this.existsByUuidAndJwt(uuid, jwt)) {
            this.throwProfileNotFoundWebRtException(uuid);
        }
        this.profileRepository.deleteById(uuid);
    }

    @Override
    public boolean existsAnyPrivilegedProfileByJwt(Jwt jwt) {
        UUID keycloakUserId = this.keycloakService.getKeycloakUserId(jwt);
        return this.profileRepository.existsByKeycloakUserIdAndPermissionType(keycloakUserId, PermissionType.ADMIN);
    }

    @Override
    public boolean existsByUuidAndJwt(UUID uuid, Jwt jwt) {
        UUID keycloakUserId = this.keycloakService.getKeycloakUserId(jwt);
        return this.profileRepository.existsByKeycloakUserIdAndUuid(keycloakUserId, uuid);
    }

    @Override
    public void existsByProfile(Profile profile) {
        if (!this.profileRepository.existsById(profile.getUuid())) {
            this.throwProfileNotFoundWebRtException(profile.getUuid());
        }
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
