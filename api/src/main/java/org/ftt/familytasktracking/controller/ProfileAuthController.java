package org.ftt.familytasktracking.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
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
    public void updatePassword(@RequestBody ProfileAuthRequestBody authBody,
                               @AuthenticationPrincipal Jwt jwt) {
        this.profileAuthService.updateProfilePassword(authBody.profileUuid, jwt, authBody.password);
    }
}

@Getter
@Setter
class ProfileAuthRequestBody {
    @NotNull
    UUID profileUuid;
    String password = "";
}

@Getter
@Setter
@AllArgsConstructor
class ProfileAuthResponseBody {
    UUID sessionId;
}
