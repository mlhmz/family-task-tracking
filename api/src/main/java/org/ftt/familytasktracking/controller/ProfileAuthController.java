package org.ftt.familytasktracking.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.ftt.familytasktracking.config.ApplicationConfigProperties;
import org.ftt.familytasktracking.dtos.ProfileResponseDto;
import org.ftt.familytasktracking.enums.PermissionType;
import org.ftt.familytasktracking.exceptions.WebRtException;
import org.ftt.familytasktracking.services.ProfileAuthService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Controller for all Profile Auth related Actions
 */
@RestController
@RequestMapping("/api/v1/profiles/auth")
public class ProfileAuthController {
    private final ProfileAuthService profileAuthService;

    public ProfileAuthController(ProfileAuthService profileAuthService) {
        this.profileAuthService = profileAuthService;
    }

    /**
     * Authenticates a Profile and returns a {@link ProfileAuthResponseBody}
     *
     * @param authBody {@link ProfileAuthRequestBody} which contains the Data for the Authentication
     *                 (Constraints will be validated)
     * @param jwt      {@link Jwt} to make sure that the user can only log into Profiles that are in the household
     * @return {@link ProfileAuthResponseBody} with the Session Data
     */
    @PostMapping
    public ProfileAuthResponseBody authenticate(@RequestBody @Valid ProfileAuthRequestBody authBody,
                                                @AuthenticationPrincipal Jwt jwt) {
        if (this.profileAuthService.isProfilePasswordValid(authBody.profileUuid, jwt, authBody.password)) {
            return new ProfileAuthResponseBody(this.profileAuthService.createSession(authBody.profileUuid));
        } else {
            throw new WebRtException(HttpStatus.UNAUTHORIZED, "Failed login");
        }
    }

    /**
     * Updates the Password of a User.
     * <p>
     * <b>IMPORTANT:</b> Privileged Users can update other Users Passwords while unprivileged Users
     * can only Update their own Password.
     * <p>
     * When Users don't type the Profile UUID into the Payload, their own Password will be updated.
     *
     * @param sessionId Session ID as {@link UUID} of the Profile
     * @param authBody  {@link ProfileAuthRequestBody} of the Profile (Constraints won't be validated)
     * @param jwt       {@link Jwt} of the Household to make sure that only Household-intern Profiles can be updated
     *                  by Admins
     */
    @PutMapping
    public void updatePassword(@RequestHeader(ApplicationConfigProperties.SESSION_ID_KEY) UUID sessionId,
                               @RequestBody ProfileAuthRequestBody authBody, @AuthenticationPrincipal Jwt jwt) {
        ProfileResponseDto profile = this.profileAuthService.getProfileBySession(sessionId, jwt).toResponseDto();
        if (authBody.profileUuid == null) {
            this.profileAuthService.updateProfilePassword(UUID.fromString(profile.uuid()), jwt, authBody.password);
        } else if (hasAdminPermission(profile)) {
            this.profileAuthService.updateProfilePassword(authBody.profileUuid, jwt, authBody.password);
        } else if (isProfileUuidEqualToRequestedUuid(UUID.fromString(profile.uuid()), authBody.profileUuid)) {
            this.profileAuthService.updateProfilePassword(UUID.fromString(profile.uuid()), jwt, authBody.password);
        } else {
            throw new WebRtException(HttpStatus.FORBIDDEN, "You have no permission to set the password of others");
        }
    }

    /**
     * Checks if Profile UUID is equal to the requested one.
     *
     * @param uuid        Requested {@link UUID}
     * @param profileUuid {@link UUID} of the Profile
     * @return boolean if they're equal
     */
    private boolean isProfileUuidEqualToRequestedUuid(UUID uuid, UUID profileUuid) {
        return profileUuid.equals(uuid);
    }

    /**
     * Checks if a Profile has privileged Permissions
     *
     * @param profile Profile that is being checked
     * @return boolean if the Profile has privileged Permissions
     */
    private boolean hasAdminPermission(ProfileResponseDto profile) {
        return profile.permissionType() == PermissionType.ADMIN;
    }

    /**
     * Request Body for Auth Requests contains the {@link UUID} of the Profile that should get
     * authenticated and optionally a password, if the profile has one.
     */
    @Getter
    @Setter
    private static class ProfileAuthRequestBody {
        @NotNull
        UUID profileUuid;
        String password = "";
    }

    /**
     * Response Body for Auth Requests, contains the sessionId
     */
    @Getter
    @Setter
    @AllArgsConstructor
    private static class ProfileAuthResponseBody {
        UUID sessionId;
    }
}
