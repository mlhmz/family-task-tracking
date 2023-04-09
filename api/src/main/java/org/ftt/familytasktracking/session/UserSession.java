package org.ftt.familytasktracking.session;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserSession(UUID sessionId, UUID profileId, LocalDateTime expiresAt) {
}
