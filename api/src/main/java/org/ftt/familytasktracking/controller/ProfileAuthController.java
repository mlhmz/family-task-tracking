package org.ftt.familytasktracking.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.ftt.familytasktracking.dtos.ProfileResponseDto;
import org.ftt.familytasktracking.enums.PermissionType;
import org.ftt.familytasktracking.exceptions.WebRtException;
import org.ftt.familytasktracking.services.ProfileAuthService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/profiles/auth")
public class ProfileAuthController {
    private final ProfileAuthService profileAuthService;

    public ProfileAuthController(ProfileAuthService profileAuthService) {
        this.profileAuthService = profileAuthService;
    }

    @PostMapping
    public ProfileAuthResponseBody authenticate(@RequestBody @Valid ProfileAuthRequestBody authBody,
                                                @AuthenticationPrincipal Jwt jwt) {
        if (this.profileAuthService.isProfilePasswordValid(authBody.profileUuid, jwt, authBody.password)) {
            return new ProfileAuthResponseBody(this.profileAuthService.createSession(authBody.profileUuid));
        } else {
            throw new WebRtException(HttpStatus.UNAUTHORIZED, "Failed login");
        }
    }

    @PutMapping
    public void updatePassword(@RequestHeader("session-id") UUID sessionId,
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

    private boolean isProfileUuidEqualToRequestedUuid(UUID uuid, UUID profileUuid) {
        return profileUuid.equals(uuid);
    }

    private boolean hasAdminPermission(ProfileResponseDto profile) {
        return profile.permissionType() == PermissionType.ADMIN;
    }

    @Getter
    @Setter
    private static class ProfileAuthRequestBody {
        @NotNull
        UUID profileUuid;
        String password = "";
    }

    @Getter
    @Setter
    @AllArgsConstructor
    private static class ProfileAuthResponseBody {
        UUID sessionId;
    }
}
