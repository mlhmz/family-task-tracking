package org.ftt.familytasktracking.services;

import io.micrometer.common.util.StringUtils;
import org.ftt.familytasktracking.exceptions.WebRtExec;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.regex.Pattern;

/**
 * Implementation of {@link KeycloakService}
 */
@Service
public class KeycloakServiceImpl implements KeycloakService {
    private static final Pattern UUID_REGEX =
            Pattern.compile("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");

    /**
     * Checks with Pattern Matcher {@link #UUID_REGEX} if the Jwt Subject contains a UUID.
     *
     * @param token {@link Jwt}-Object with Subject
     * @return boolean if {@link Jwt#getSubject()} contains a UUID
     */
    @Override
    public boolean isJwtSubjectContainingUUID(Jwt token) {
        String subject = token.getSubject();
        return StringUtils.isNotEmpty(subject) && UUID_REGEX.matcher(subject).matches();
    }

    /**
     * Fetches Keycloak User ID from Jwt and parses it as UUID
     *
     * @param token {@link Jwt}-Object with Subject
     * @return {@link UUID} from {@link Jwt}
     * @throws WebRtExec with {@link HttpStatus#UNAUTHORIZED} if the Subject isn't containing a UUID.
     */
    @Override
    public UUID getKeycloakUserId(Jwt token) {
        if (isJwtSubjectContainingUUID(token)) {
            String subject = token.getSubject();
            return UUID.fromString(subject);
        } else {
            throw new WebRtExec(HttpStatus.UNAUTHORIZED, "The JWT Payload is not valid");
        }
    }
}
