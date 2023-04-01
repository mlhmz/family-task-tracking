package org.ftt.familytasktracking.controller;

import org.ftt.familytasktracking.dtos.ProfileRequestDto;
import org.ftt.familytasktracking.dtos.ProfileResponseDto;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.models.ProfileModel;
import org.ftt.familytasktracking.services.ProfileService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controller for Profile related Stuff
 */
@RestController
@RequestMapping("/api/v1/profiles")
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    /**
     * Gets all {@link Profile}-Entities by the {@link Jwt} that is bound to the
     * {@link org.ftt.familytasktracking.entities.Household}
     *
     * @param jwt of the household / keycloak user
     * @return {@link List} of {@link ProfileResponseDto}
     */
    @GetMapping
    public List<ProfileResponseDto> getAllProfilesByJwt(@AuthenticationPrincipal Jwt jwt) {
        List<ProfileModel> modelList = this.profileService.getAllProfilesByJwt(jwt);
        return modelList
                .stream()
                .map(ProfileModel::toResponseDto)
                .toList();
    }

    /**
     * Gets a {@link Profile}-Entity by the {@link Jwt} and by the {@link UUID}
     *
     * @param uuid of the profile
     * @param jwt  of the household / keycloak user
     * @return {@link ProfileResponseDto}
     */
    @GetMapping("/{uuid}")
    public ProfileResponseDto getProfileByUuidAndJwt(@PathVariable("uuid") UUID uuid,
                                                     @AuthenticationPrincipal Jwt jwt) {
        ProfileModel model = this.profileService.getProfileByUuidAndJwt(uuid, jwt);
        return model.toResponseDto();
    }

    @PutMapping("/{uuid}")
    public ProfileResponseDto updateProfileByUuidAndJwt(@PathVariable("uuid") UUID uuid,
                                                        @RequestBody ProfileRequestDto profileRequestDto,
                                                        @AuthenticationPrincipal Jwt jwt) {
        ProfileModel updateModel = this.profileService.buildModelFromProfileRequestDto(profileRequestDto);
        ProfileModel targetModel = this.profileService.getProfileByUuidAndJwt(uuid, jwt);
        ProfileModel persistedModel = this.profileService.updateProfile(updateModel, targetModel, true);
        return persistedModel.toResponseDto();
    }
}
