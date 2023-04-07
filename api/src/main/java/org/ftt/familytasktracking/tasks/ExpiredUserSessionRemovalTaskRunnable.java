package org.ftt.familytasktracking.tasks;

import lombok.extern.slf4j.Slf4j;
import org.ftt.familytasktracking.services.UserSessionService;

/**
 * Runnable that removes all expired user sessions
 */
@Slf4j
public class ExpiredUserSessionRemovalTaskRunnable implements Runnable {
    private final UserSessionService userSessionService;

    public ExpiredUserSessionRemovalTaskRunnable(UserSessionService userSessionService) {
        this.userSessionService = userSessionService;
    }

    @Override
    public void run() {
        long removedSessions = this.userSessionService.removeAllExpiredSessions();
        log.info("{} Sessions were expired and have been removed.", removedSessions);
    }
}
