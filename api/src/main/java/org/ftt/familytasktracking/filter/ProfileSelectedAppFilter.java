package org.ftt.familytasktracking.filter;

import org.ftt.familytasktracking.config.ApplicationConfigProperties;
import org.ftt.familytasktracking.exceptions.WebRtException;
import org.ftt.familytasktracking.services.HouseholdService;
import org.ftt.familytasktracking.services.ProfileAuthService;
import org.ftt.familytasktracking.services.ProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;

import java.util.UUID;

/**
 * Filter that is making sure, that only requests, having a selected authenticated profile
 * in the session id will use the resources that are matching with the {@link jakarta.servlet.annotation.WebFilter}
 */
public class ProfileSelectedAppFilter extends AppFilter {
    private final ProfileAuthService profileAuthService;
    private final ProfileService profileService;
    private final HouseholdService householdService;

    public ProfileSelectedAppFilter(JwtDecoder jwtDecoder, ApplicationConfigProperties appProps,
                                    ProfileAuthService profileAuthService, ProfileService profileService,
                                    HouseholdService householdService) {
        super(jwtDecoder, appProps);
        this.profileAuthService = profileAuthService;
        this.profileService = profileService;
        this.householdService = householdService;
    }

    @Override
    protected void doAuthFilter(Jwt jwt) {
        if (isHouseholdNotSetUpYet(householdService, profileService, jwt)) {
            return;
        }

        String sessionId = getHeader(appProps.getSessionIdHeaderName());

        UUID uuid = parseSessionId(sessionId);

        if (isSessionNotValid(jwt, uuid)) {
            throw new WebRtException(HttpStatus.UNAUTHORIZED, "The user session is not valid");
        }

    }

    private boolean isSessionNotValid(Jwt jwt, UUID uuid) {
        return !profileAuthService.isProfileSessionValid(uuid, jwt);
    }
}
