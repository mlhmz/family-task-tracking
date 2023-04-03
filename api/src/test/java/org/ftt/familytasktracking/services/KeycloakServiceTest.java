package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.exceptions.WebRtException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Test für Keycloak Service.
 * <p>
 * Falls die Implementationsklasse des {@link KeycloakService}-Interfaces ausgetauscht wird, muss diese in der
 * {@link SpringBootTest}-Annotation ersetzt werden.
 */
@SpringBootTest(classes = {KeycloakServiceTest.class, KeycloakServiceImpl.class})
class KeycloakServiceTest {
    @Autowired
    KeycloakService keycloakService;

    @Test
    void isJwtSubjectContainingUUID_ReturnsTrueOnValidData() {
        Jwt jwt = Jwt.withTokenValue("TEST_TOKEN")
                .header("TEST", "TEST")
                .subject(UUID.randomUUID().toString())
                .build();
        assertThat(keycloakService.isJwtSubjectContainingUUID(jwt)).isTrue();
    }

    @Test
    void getKeycloakUserId_ReturnsValidIdOnValidData() {
        UUID userId = UUID.randomUUID();
        Jwt jwt = Jwt.withTokenValue("TEST_TOKEN")
                .header("TEST", "TEST")
                .subject(userId.toString())
                .build();
        assertThat(keycloakService.getKeycloakUserId(jwt)).isEqualTo(userId);
    }

    @Test
    void getKeycloakUserId_ThrowsWebRtExceptionOnJwtWithoutValidSubject() {
        Jwt jwt = Jwt.withTokenValue("TEST_TOKEN")
                .header("TEST", "TEST")
                .subject("INVALID-TOKEN")
                .build();
        assertThatThrownBy(() -> keycloakService.getKeycloakUserId(jwt)).isInstanceOf(WebRtException.class);
    }
}
