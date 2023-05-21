package org.ftt.familytasktracking.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.apache.commons.lang3.StringUtils;
import org.ftt.familytasktracking.config.ApplicationConfigProperties;
import org.ftt.familytasktracking.dtos.ProfileRequestDto;
import org.ftt.familytasktracking.dtos.ProfileResponseDto;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.exceptions.ErrorDetails;
import org.ftt.familytasktracking.models.ProfileModel;
import org.ftt.familytasktracking.services.ProfileAuthService;
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
    private final ProfileAuthService profileAuthService;

    public ProfileController(ProfileService profileService, ProfileAuthService profileAuthService) {
        this.profileService = profileService;
        this.profileAuthService = profileAuthService;
    }

    /**
     * Gets all {@link Profile}-Entities by the {@link Jwt} that is bound to the
     * {@link org.ftt.familytasktracking.entities.Household}
     *
     * @param jwt of the household / keycloak user
     * @return {@link List} of {@link ProfileResponseDto}
     */
    @Operation(summary = "Gets all Profiles of a Household by the Authorization-Token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found profile",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProfileResponseDto.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid JSON submitted",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "401", description = "Request doesn't contain valid bearer token or " +
                    "Session ID is not valid",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "404", description = "Profile couldn't be found",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}
            )}
    )
    @GetMapping
    public List<ProfileResponseDto> getAllProfilesByJwt(@RequestParam(value = "query", required = false) String query,
                                                        @AuthenticationPrincipal Jwt jwt) {
        return StringUtils.isEmpty(query) ?
                mapModelCollectionToDtoCollection(this.profileService.getAllProfilesByJwt(jwt)) :
                mapModelCollectionToDtoCollection(this.profileService.getAllProfilesByJwtAndSearchQuery(jwt, query));
    }

    /**
     * Gets a {@link Profile}-Entity by the {@link Jwt} and by the {@link UUID}
     *
     * @param uuid of the profile
     * @param jwt  of the household / keycloak user
     * @return {@link ProfileResponseDto}
     */
    @Operation(summary = "Gets a Profile by its UUID and the Authorization-Token of the Household")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found profile",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProfileResponseDto.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid JSON submitted",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "401", description = "Request doesn't contain valid bearer token or " +
                    "Session ID is not valid",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "404", description = "Profile couldn't be found",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}
            )}
    )
    @GetMapping("/{uuid}")
    public ProfileResponseDto getProfileByUuidAndJwt(@PathVariable("uuid") UUID uuid,
                                                     @AuthenticationPrincipal Jwt jwt) {
        ProfileModel model = this.profileService.getProfileByUuidAndJwt(uuid, jwt);
        return model.toResponseDto();
    }

    /**
     * Gets the {@link Profile}-Entity of an authorized Profile by the Session ID and the
     * Jwt of the Profiles Household
     *
     * @param sessionId Session ID of the {@link Profile}
     * @param jwt       {@link Jwt} of the {@link org.ftt.familytasktracking.entities.Household}
     * @return {@link ProfileResponseDto} with the Profile
     */
    @Operation(summary = "Gets the User Profile of a Profile-Session")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found profile",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProfileResponseDto.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid JSON submitted",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "401", description = "Request doesn't contain valid bearer token or " +
                    "Session ID is not valid",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "404", description = "Profile couldn't be found from session",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}
            )}
    )
    @GetMapping("/profile")
    public ProfileResponseDto getProfileBySessionId(
            @RequestHeader(ApplicationConfigProperties.SESSION_ID_KEY) UUID sessionId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return this.profileAuthService.getProfileBySession(sessionId, jwt).toResponseDto();
    }

    /**
     * Safely Updates the {@link Profile}-Entity of an authorized Profile by the Session ID and the
     * Jwt of the Profiles Household.
     *
     * @param sessionId         Session ID of the {@link Profile}
     * @param profileRequestDto with Update-Payload
     * @param jwt               {@link Jwt} of the {@link org.ftt.familytasktracking.entities.Household}
     * @return {@link ProfileResponseDto} with the Profile
     * @see ProfileService#updateProfile(ProfileModel, ProfileModel, boolean) The updateProfile Method to understand
     * safe Update
     */
    @Operation(summary = "Updates the User Profile safely of a Profile-Session " +
            "(Safely means that the Points and the PermissionType will be ignored).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Updated Profile",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProfileResponseDto.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid JSON submitted",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "401", description = "Request doesn't contain valid bearer token or " +
                    "Session ID is not valid",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "404", description = "Profile to update couldn't be found from session",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}
            )}
    )
    @PutMapping("/profile")
    public ProfileResponseDto updateProfileByUuidAndJwt(
            @RequestHeader(ApplicationConfigProperties.SESSION_ID_KEY) UUID sessionId,
            @RequestBody ProfileRequestDto profileRequestDto,
            @AuthenticationPrincipal Jwt jwt
    ) {

        ProfileModel updateModel = this.profileService.buildModelFromProfileRequestDto(profileRequestDto);
        ProfileModel targetModel = profileAuthService.getProfileBySession(sessionId, jwt);
        ProfileModel persistedModel = this.profileService.updateProfile(updateModel, targetModel, true);
        return persistedModel.toResponseDto();
    }

    private List<ProfileResponseDto> mapModelCollectionToDtoCollection(List<ProfileModel> modelList) {
        return modelList
                .stream()
                .map(ProfileModel::toResponseDto)
                .toList();
    }
}
