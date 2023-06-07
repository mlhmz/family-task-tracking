package org.ftt.familytasktracking.filter;

import jakarta.servlet.annotation.WebFilter;
import lombok.extern.slf4j.Slf4j;
import org.ftt.familytasktracking.config.ApplicationConfigProperties;
import org.ftt.familytasktracking.exceptions.WebRtException;
import org.ftt.familytasktracking.services.ProfileAuthService;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;

import java.util.UUID;

/**
 * Filter that is making sure, that only requests, having a selected authenticated profile
 * in the session id will use the resources that are matching with the {@link jakarta.servlet.annotation.WebFilter}
 */
@WebFilter(urlPatterns = {"/api/v1/tasks/*", "/api/v1/rewards/*"})
@Slf4j
public class ProfileSelectedAppFilter extends AppFilter {
    private final ProfileAuthService profileAuthService;

    public ProfileSelectedAppFilter(JwtDecoder jwtDecoder, ApplicationConfigProperties appProps,
                                    ProfileAuthService profileAuthService) {
        super(jwtDecoder, appProps);
        this.profileAuthService = profileAuthService;
    }

    @Override
    protected void doAppFilter(Jwt jwt) {
        String sessionId = getHeader(appProps.getSessionIdHeaderName());

        UUID uuid = parseSessionId(sessionId);

        if (isSessionNotValid(jwt, uuid)) {
            log.debug("The user session of the session id is not valid {}.", uuid);
            throw new WebRtException(HttpStatus.UNAUTHORIZED, "The user session is not valid");
        }

    }

    private boolean isSessionNotValid(Jwt jwt, UUID uuid) {
        return !profileAuthService.isProfileSessionValid(uuid, jwt);
    }
}
