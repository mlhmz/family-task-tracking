package org.ftt.familytasktracking.filter;

import jakarta.servlet.annotation.WebFilter;
import org.apache.commons.lang3.StringUtils;
import org.ftt.familytasktracking.config.ApplicationConfigProperties;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.enums.PermissionType;
import org.ftt.familytasktracking.exceptions.WebRtException;
import org.ftt.familytasktracking.services.HouseholdService;
import org.ftt.familytasktracking.services.ProfileAuthService;
import org.ftt.familytasktracking.services.ProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;

import java.util.UUID;

@WebFilter(urlPatterns = {"/api/v1/admin/*"})
public class ProfileAdminAuthorizedFilter extends AuthorizedFilter {
    private final ProfileAuthService profileAuthService;
    private final ProfileService profileService;
    private final HouseholdService householdService;

    public ProfileAdminAuthorizedFilter(JwtDecoder jwtDecoder, ApplicationConfigProperties applicationConfigProperties,
                                        ProfileAuthService profileAuthService, ProfileService profileService,
                                        HouseholdService householdService) {
        super(jwtDecoder, applicationConfigProperties);
        this.profileAuthService = profileAuthService;
        this.profileService = profileService;
        this.householdService = householdService;
    }

    @Override
    public void doAuthFilter(Jwt jwt) {
        if (isHouseholdNotSetUpYet(jwt)) {
            return;
        }

        String sessionId = getHeader(appProps.getSessionIdHeaderName());

        UUID uuid = buildUuidFromSessionId(sessionId);

        Profile profile = profileAuthService.getProfileBySession(uuid, jwt).toEntity();

        if (isProfileNotAdmin(profile)) {
            throw new WebRtException(HttpStatus.FORBIDDEN, "The selected profile is not allowed to use this resource.");
        }
    }

    private boolean isHouseholdNotSetUpYet(Jwt jwt) {
        return isNoHouseholdBoundToJwt(jwt) || isNoAdminProfileExistingByJwt(jwt);
    }

    private boolean isNoAdminProfileExistingByJwt(Jwt jwt) {
        return !profileService.existsAnyAdminProfileByJwt(jwt);
    }

    private boolean isNoHouseholdBoundToJwt(Jwt jwt) {
        return !householdService.isHouseholdBoundToJwt(jwt);
    }

    private UUID buildUuidFromSessionId(String sessionId) {
        UUID uuid;
        if (StringUtils.isNotEmpty(sessionId) && UUID_REGEX.matcher(sessionId).matches()) {
            uuid = UUID.fromString(sessionId);
        } else {
            throw new WebRtException(HttpStatus.UNAUTHORIZED, "The session id is malformed.");
        }
        return uuid;
    }

    private boolean isProfileNotAdmin(Profile profile) {
        return profile.getPermissionType() != PermissionType.ADMIN;
    }
}
