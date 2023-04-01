package org.ftt.familytasktracking.filter;

import jakarta.servlet.annotation.WebFilter;
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

/**
 * Filter that is making sure, that only requests, having a selected authenticated admin profile
 * in the session id will use the resources that are matching with the {@link jakarta.servlet.annotation.WebFilter}
 */
@WebFilter(urlPatterns = {"/api/v1/admin/*"})
public class ProfileAdminAppFilter extends AppFilter {
    private final ProfileAuthService profileAuthService;
    private final ProfileService profileService;
    private final HouseholdService householdService;

    public ProfileAdminAppFilter(JwtDecoder jwtDecoder, ApplicationConfigProperties applicationConfigProperties,
                                 ProfileAuthService profileAuthService, ProfileService profileService,
                                 HouseholdService householdService) {
        super(jwtDecoder, applicationConfigProperties);
        this.profileAuthService = profileAuthService;
        this.profileService = profileService;
        this.householdService = householdService;
    }

    @Override
    public void doAuthFilter(Jwt jwt) {
        if (isHouseholdNotSetUpYet(householdService, profileService, jwt)) {
            return;
        }

        String sessionId = getHeader(appProps.getSessionIdHeaderName());

        UUID uuid = parseSessionId(sessionId);

        Profile profile = profileAuthService.getProfileBySession(uuid, jwt).toEntity();

        if (isProfileNotAdmin(profile)) {
            throw new WebRtException(HttpStatus.FORBIDDEN, "The selected profile is not allowed to use this resource.");
        }
    }

    private boolean isProfileNotAdmin(Profile profile) {
        return profile.getPermissionType() != PermissionType.ADMIN;
    }
}
