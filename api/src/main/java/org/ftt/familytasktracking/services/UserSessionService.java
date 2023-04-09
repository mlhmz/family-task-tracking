package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.session.UserSession;

import java.util.UUID;

/**
 * The session service manages a map of {@link UserSession}-Records with several methods.
 */
public interface UserSessionService {
    /**
     * Checks if a {@link UserSession} exists and if it isn't expired yet
     *
     * @param sessionId Session ID of the {@link UserSession}
     * @return boolean if the specified {@link UserSession}
     */
    boolean isSessionExistingAndNotExpiredYet(UUID sessionId);

    /**
     * Removes all expired User Sessions
     *
     * @return Count that shows how many sessions have been removed
     */
    long removeAllExpiredSessions();

    /**
     * Gets a {@link UserSession}
     *
     * @param sessionId Session ID of the User Session
     * @return {@link UserSession} of the Session ID
     * @throws org.ftt.familytasktracking.exceptions.WebRtException when Session doesn't exists
     */
    UserSession getSession(UUID sessionId);

    /**
     * Stores a {@link UserSession}
     *
     * @param subject User identifier to store
     * @return {@link UserSession}-Object
     */
    UserSession storeSession(UUID subject);
}
