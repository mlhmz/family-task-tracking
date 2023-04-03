package org.ftt.familytasktracking.filter;

import jakarta.servlet.annotation.WebFilter;
import lombok.extern.slf4j.Slf4j;
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
 * <p>
 * When the Keycloak Users Data is not fully set up (No household or no admin profile in the household),
 * every Route can be used by any person that is authorized in Keycloak.
 */
@WebFilter(urlPatterns = {"/api/v1/admin/*"})
@Slf4j
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
    public void doAppFilter(Jwt jwt) {
        if (isHouseholdNotSetUpYet(householdService, profileService, jwt)) {
            log.debug("The filter won't be triggered because the household of the Keycloak User {} isn't set up yet.",
                    jwt.getSubject());
            return;
        }

        String sessionId = getHeader(appProps.getSessionIdHeaderName());

        UUID uuid = parseSessionId(sessionId);

        Profile profile = profileAuthService.getProfileBySession(uuid, jwt).toEntity();

        if (isProfileNotAdmin(profile)) {
            log.debug("The selected profile {} is not allowed to use this resource.", profile.getUuid());
            throw new WebRtException(HttpStatus.FORBIDDEN, "The selected profile is not allowed to use this resource.");
        }
    }


    private boolean isHouseholdNotSetUpYet(HouseholdService householdService,
                                           ProfileService profileService,
                                           Jwt jwt) {
        return isNoHouseholdBoundToJwt(householdService, jwt) ||
                isNoAdminProfileExistingByJwt(profileService, jwt);
    }

    private boolean isNoHouseholdBoundToJwt(HouseholdService householdService, Jwt jwt) {
        return !householdService.isHouseholdBoundToJwt(jwt);
    }

    private boolean isNoAdminProfileExistingByJwt(ProfileService profileService, Jwt jwt) {
        return !profileService.existsAnyPrivilegedProfileByJwt(jwt);
    }

    private boolean isProfileNotAdmin(Profile profile) {
        return profile.getPermissionType() != PermissionType.ADMIN;
    }
}
