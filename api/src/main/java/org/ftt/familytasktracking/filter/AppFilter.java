package org.ftt.familytasktracking.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.ftt.familytasktracking.config.ApplicationConfigProperties;
import org.ftt.familytasktracking.exceptions.ErrorDetails;
import org.ftt.familytasktracking.exceptions.WebRtException;
import org.ftt.familytasktracking.services.HouseholdService;
import org.ftt.familytasktracking.services.ProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;
import java.util.regex.Pattern;

@Component
@Slf4j
public abstract class AppFilter implements Filter {
    protected static final Pattern UUID_REGEX =
            Pattern.compile("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");
    protected HttpServletRequest request;
    protected HttpServletResponse response;
    protected JwtDecoder jwtDecoder;
    protected ApplicationConfigProperties appProps;

    protected AppFilter(JwtDecoder jwtDecoder, ApplicationConfigProperties appProps) {
        this.jwtDecoder = jwtDecoder;
        this.appProps = appProps;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        this.request = (HttpServletRequest) request;
        this.response = (HttpServletResponse) response;

        String jwtKey = getHeader("Authorization").split(" ")[1];
        Jwt jwt = jwtDecoder.decode(jwtKey);

        try {
            doAuthFilter(jwt);
            chain.doFilter(request, response);
        } catch (WebRtException exception) {
            convertWebRtExceptionToServletError(exception);
        }
    }

    protected String getHeader(String headerName) {
        return this.request.getHeader(headerName);
    }

    protected void convertWebRtExceptionToServletError(WebRtException exception) throws IOException {
        ErrorDetails errorDetails = exception.getErrorDetails();
        this.response.sendError(errorDetails.httpStatus(), errorDetails.message());
    }

    protected abstract void doAuthFilter(Jwt jwt);

    protected UUID parseSessionId(String sessionId) {
        UUID uuid;
        if (StringUtils.isNotEmpty(sessionId) && UUID_REGEX.matcher(sessionId).matches()) {
            uuid = UUID.fromString(sessionId);
        } else {
            throw new WebRtException(HttpStatus.UNAUTHORIZED, "The session id is malformed.");
        }
        return uuid;
    }

    protected boolean isHouseholdNotSetUpYet(HouseholdService householdService,
                                             ProfileService profileService,
                                             Jwt jwt) {
        return isNoHouseholdBoundToJwt(householdService, jwt) ||
                isNoAdminProfileExistingByJwt(profileService, jwt);
    }

    protected boolean isNoHouseholdBoundToJwt(HouseholdService householdService, Jwt jwt) {
        return !householdService.isHouseholdBoundToJwt(jwt);
    }

    protected boolean isNoAdminProfileExistingByJwt(ProfileService profileService, Jwt jwt) {
        return !profileService.existsAnyAdminProfileByJwt(jwt);
    }
}
