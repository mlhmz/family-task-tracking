package org.ftt.familytasktracking.controller;

import org.ftt.familytasktracking.dtos.ProfileRequestDto;
import org.ftt.familytasktracking.dtos.ProfileResponseDto;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.mappers.ProfileMapper;
import org.ftt.familytasktracking.services.ProfileService;
import org.springframework.http.ResponseEntity;
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
    private final ProfileMapper profileMapper;
    private final ProfileService profileService;

    public ProfileController(ProfileMapper profileMapper, ProfileService profileService) {
        this.profileMapper = profileMapper;
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
        List<Profile> profileList = this.profileService.getAllProfilesByJwt(jwt);
        return profileList
                .stream()
                .map(profileMapper::mapProfileToProfileDto)
                .toList();
    }

    /**
     * Gets a {@link Profile}-Entity by the {@link Jwt} and by the {@link UUID}
     *
     * @param uuid of the profile
     * @param jwt of the household / keycloak user
     * @return {@link ProfileResponseDto}
     */
    @GetMapping("/{uuid}")
    public ProfileResponseDto getProfileByUuidAndJwt(@PathVariable("uuid") UUID uuid,
                                                     @AuthenticationPrincipal Jwt jwt) {
        Profile profile = this.profileService.getProfileByUuidAndJwt(uuid, jwt);
        return this.profileMapper.mapProfileToProfileDto(profile);
    }

    /**
     * Creates a Profile and binds a {@link org.ftt.familytasktracking.entities.Household}
     * with the {@link Jwt} to it
     *
     * @param profileRequestDto Content of the new Profile
     * @param jwt of the Household that the Profile is assigned to
     * @return {@link ProfileResponseDto} with the persisted Profile
     */
    @PostMapping
    public ProfileResponseDto createProfileWithJwt(@RequestBody ProfileRequestDto profileRequestDto,
                                                   @AuthenticationPrincipal Jwt jwt) {
        Profile profile = this.profileMapper.mapProfileDtoToProfile(profileRequestDto);
        Profile persistedProfile = this.profileService.createProfile(profile, jwt);
        return this.profileMapper.mapProfileToProfileDto(persistedProfile);
    }

    /**
     * Updates a Profile identified by its {@link UUID} and by the {@link Jwt}
     *
     * @param uuid {@link Profile}'s identifier
     * @param profileRequestDto Update Content
     * @param jwt Household Identifier
     * @return Persisted {@link ProfileResponseDto}
     */
    @PutMapping("/{uuid}")
    public ProfileResponseDto updateProfileByUuidAndJwt(@PathVariable("uuid") UUID uuid,
                                                        @RequestBody ProfileRequestDto profileRequestDto,
                                                        @AuthenticationPrincipal Jwt jwt) {
        Profile profile = this.profileService.getProfileByUuidAndJwt(uuid, jwt);
        this.profileMapper.updateProfileFromDto(profileRequestDto, profile);
        Profile persistedProfile = this.profileService.updateProfile(profile);
        return this.profileMapper.mapProfileToProfileDto(persistedProfile);
    }

    /**
     * Deletes a Profile identified by its {@link UUID} and by the {@link Jwt}
     *
     * @param uuid Identifier of the Profile
     * @param jwt Household Identifier
     * @return No Content Response
     */
    @DeleteMapping("/{uuid}")
    public ResponseEntity<?> deleteProfileByUuidAndJwt(@PathVariable("uuid") UUID uuid,
                                                       @AuthenticationPrincipal Jwt jwt) {
        this.profileService.deleteProfileByUuid(uuid, jwt);
        return ResponseEntity.noContent().build();
    }
}
