package org.ftt.familytasktracking.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.ftt.familytasktracking.dtos.ProfileRequestDto;
import org.ftt.familytasktracking.dtos.ProfileResponseDto;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.exceptions.ErrorDetails;
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
    @Operation(summary = "Creates a Profile with the Authorization-Token to identify the Household")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Created profile",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProfileResponseDto.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid JSON submitted",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "401", description = "Request doesn't contain valid bearer token or " +
                    "Session Id is invalid",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "403", description = "The profile is unprivileged",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))})
    }
    )
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
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
    @Operation(summary = "Updates a Profile by it's UUID and it's Authorization-Token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found profile and updated it",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProfileResponseDto.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid JSON submitted",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "401", description = "Request doesn't contain valid bearer token or " +
                    "Session Id is invalid",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "403", description = "The profile is unprivileged",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "404", description = "Profile to update couldn't be found",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}
            )}
    )
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
    @Operation(summary = "Deletes a Profile by it's UUID and it's Authorization-Token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Found profile and deleted it",
                    content = {@Content(mediaType = "application/json")}),
            @ApiResponse(responseCode = "401", description = "Request doesn't contain valid bearer token or " +
                    "Session Id is invalid",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "403", description = "The profile is unprivileged",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "404", description = "Profile to delete couldn't be found",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}
            )}
    )
    @DeleteMapping("/{uuid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProfileByUuidAndJwt(@PathVariable("uuid") UUID uuid,
                                          @AuthenticationPrincipal Jwt jwt) {
        this.profileService.deleteProfileByUuid(uuid, jwt);
    }
}
