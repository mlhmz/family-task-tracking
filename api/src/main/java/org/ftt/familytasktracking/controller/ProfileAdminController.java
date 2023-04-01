package org.ftt.familytasktracking.controller;

import org.ftt.familytasktracking.dtos.ProfileRequestDto;
import org.ftt.familytasktracking.dtos.ProfileResponseDto;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.models.ProfileModel;
import org.ftt.familytasktracking.services.ProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Controller for Profile related Stuff
 */
@RestController
@RequestMapping("/api/v1/admin/profiles")
public class ProfileAdminController {
    private final ProfileService profileService;

    public ProfileAdminController(ProfileService profileService) {
        this.profileService = profileService;
    }

    /**
     * Creates a Profile and binds a {@link org.ftt.familytasktracking.entities.Household}
     * with the {@link Jwt} to it
     *
     * @param profileRequestDto Content of the new Profile
     * @param jwt               of the Household that the Profile is assigned to
     * @return {@link ProfileResponseDto} with the persisted Profile
     */
    @PostMapping
    public ProfileResponseDto createProfileWithJwt(@RequestBody ProfileRequestDto profileRequestDto,
                                                   @AuthenticationPrincipal Jwt jwt) {
        ProfileModel model = this.profileService.buildModelFromProfileRequestDto(profileRequestDto);
        ProfileModel persistedModel = this.profileService.createProfile(model, jwt);
        return persistedModel.toResponseDto();
    }

    /**
     * Updates a Profile identified by its {@link UUID} and by the {@link Jwt}
     *
     * @param uuid              {@link Profile}'s identifier
     * @param profileRequestDto Update Content
     * @param jwt               Household Identifier
     * @return Persisted {@link ProfileResponseDto}
     */
    @PutMapping("/{uuid}")
    public ProfileResponseDto updateProfileByUuidAndJwt(@PathVariable("uuid") UUID uuid,
                                                        @RequestBody ProfileRequestDto profileRequestDto,
                                                        @AuthenticationPrincipal Jwt jwt) {
        ProfileModel updateModel = this.profileService.buildModelFromProfileRequestDto(profileRequestDto);
        ProfileModel targetModel = this.profileService.getProfileByUuidAndJwt(uuid, jwt);
        ProfileModel persistedModel = this.profileService.updateProfile(updateModel, targetModel, false);
        return persistedModel.toResponseDto();
    }

    /**
     * Deletes a Profile identified by its {@link UUID} and by the {@link Jwt}.
     * Returns {@link HttpStatus#NO_CONTENT}
     *
     * @param uuid Identifier of the Profile
     * @param jwt  Household Identifier
     */
    @DeleteMapping("/{uuid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProfileByUuidAndJwt(@PathVariable("uuid") UUID uuid,
                                          @AuthenticationPrincipal Jwt jwt) {
        this.profileService.deleteProfileByUuid(uuid, jwt);
    }
}
