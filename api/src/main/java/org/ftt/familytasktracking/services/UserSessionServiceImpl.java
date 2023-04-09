package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.config.ApplicationConfigProperties;
import org.ftt.familytasktracking.exceptions.WebRtException;
import org.ftt.familytasktracking.session.UserSession;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserSessionServiceImpl implements UserSessionService {
    private static final Map<UUID, UserSession> sessions = new ConcurrentHashMap<>();

    private final ApplicationConfigProperties applicationConfigProperties;

    public UserSessionServiceImpl(ApplicationConfigProperties applicationConfigProperties) {
        this.applicationConfigProperties = applicationConfigProperties;
    }

    @Override
    public boolean isSessionExistingAndNotExpiredYet(UUID sessionId) {
        UserSession session = sessions.get(sessionId);
        return isUserSessionExistingAndNotExpiredYet(session);
    }

    @Override
    public long removeAllExpiredSessions() {
        return sessions.entrySet()
                .stream()
                .filter(entry -> removeSessionIfExpired(entry.getKey(), entry.getValue()))
                .count();
    }

    @Override
    public UserSession getSession(UUID sessionId) {
        UserSession session = sessions.get(sessionId);
        if (isSessionExistingAndNotExpiredYet(sessionId)) {
            return session;
        } else {
            sessions.remove(sessionId);
            throw new WebRtException(HttpStatus.UNAUTHORIZED, "The session was not found");
        }
    }

    @Override
    public UserSession storeSession(UUID subject) {
        UUID uuid = UUID.randomUUID();
        UserSession userSession = new UserSession(uuid, subject, getSessionExpirationDate());
        sessions.put(uuid, userSession);
        return userSession;
    }

    private LocalDateTime getSessionExpirationDate() {
        int sessionExpirationInMinutes = applicationConfigProperties.getSessionExpirationInMinutes();
        return LocalDateTime.now().plusMinutes(sessionExpirationInMinutes);
    }

    private boolean removeSessionIfExpired(UUID sessionId, UserSession userSession) {
        if (!isUserSessionExistingAndNotExpiredYet(userSession)) {
            sessions.remove(sessionId);
            return true;
        } else {
            return false;
        }
    }

    private boolean isUserSessionExistingAndNotExpiredYet(UserSession session) {
        return session != null && session.expiresAt().isAfter(LocalDateTime.now());
    }
}
