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
    /**
     * Creates a Profile and assigns it to the users household by the {@link Jwt}
     *
     * @param model {@link ProfileModel} that represents the Profile Input
     * @param jwt   {@link Jwt} that is bound to the users household
     * @return {@link ProfileModel} that represents the Output
     */
    ProfileModel createProfile(ProfileModel model, Jwt jwt);

    /**
     * Updates a Profile
     *
     * @param updateModel Model with the Update-Content
     * @param targetModel The target model that entity is being updated
     * @param safe        boolean if the update should only affect safe fields (fields that unprivileged users can update)
     * @return {@link ProfileModel} that represents the Output
     */
    ProfileModel updateProfile(ProfileModel updateModel, ProfileModel targetModel, boolean safe);

    /**
     * Gets all Profiles by the {@link Jwt} of the keycloak user
     *
     * @param jwt {@link Jwt} that is bound to a household
     * @return {@link List} of {@link ProfileModel}'s that are in the household
     */
    List<ProfileModel> getAllProfilesByJwt(Jwt jwt);

    /**
     * Gets a profile of a household by the Profile UUID and the {@link Jwt}
     *
     * @param profileUuid {@link UUID} of the {@link Profile}
     * @param jwt         {@link Jwt} that is bound to the profiles household
     * @return {@link ProfileModel} that represents the Output
     */
    ProfileModel getProfileByUuidAndJwt(UUID profileUuid, Jwt jwt);

    /**
     * Deletes a {@link Profile} by the UUID
     *
     * @param uuid {@link UUID} of the Profile
     * @param jwt  {@link Jwt} that is bound to the profiles household
     */
    void deleteProfileByUuid(UUID uuid, Jwt jwt);

    /**
     * Checks if any {@link Profile} with a Privileged PermissionType exists
     *
     * @param jwt {@link Jwt} that is bound to the profiles household
     * @return boolean if any privileged Profile exists
     */
    boolean existsAnyPrivilegedProfileByJwt(Jwt jwt);

    /**
     * Checks if any {@link Profile} with a certain UUID and Jwt exists
     *
     * @param uuid {@link UUID} of the Profile
     * @param jwt  {@link Jwt} that is bound to the profiles household
     * @return boolean if the Profile exists
     */
    boolean existsByUuidAndJwt(UUID uuid, Jwt jwt);

    /**
     * Builds a Model from a {@link Profile}-Entity
     *
     * @param profile {@link Profile} entity that the model is being build from
     * @return {@link ProfileModel} that the {@link Profile} is stored in
     */
    ProfileModel buildModelFromProfileEntity(Profile profile);

    /**
     * Builds a Model from a {@link ProfileRequestDto}
     *
     * @param dto {@link ProfileRequestDto} that the model is being build from
     * @return {@link ProfileModel} that the {@link ProfileRequestDto} is being mapped and stored in
     */
    ProfileModel buildModelFromProfileRequestDto(ProfileRequestDto dto);
}
