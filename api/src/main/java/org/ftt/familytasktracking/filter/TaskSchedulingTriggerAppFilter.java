package org.ftt.familytasktracking.filter;

import jakarta.servlet.annotation.WebFilter;
import lombok.extern.slf4j.Slf4j;
import org.ftt.familytasktracking.config.ApplicationConfigProperties;
import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.services.HouseholdService;
import org.ftt.familytasktracking.services.TaskSchedulingService;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;

/**
 * Filter to refresh the Households Tasks.
 * <p/>
 * This is done with every request by a household, in order to avoid performance issues with schedulers.
 */
@WebFilter(urlPatterns = {"/api/v1/*"})
@Slf4j
public class TaskSchedulingTriggerAppFilter extends AppFilter {
    private final HouseholdService householdService;
    private final TaskSchedulingService taskSchedulingService;

    protected TaskSchedulingTriggerAppFilter(JwtDecoder jwtDecoder, ApplicationConfigProperties appProps,
                                             HouseholdService householdService, TaskSchedulingService taskSchedulingService) {
        super(jwtDecoder, appProps);
        this.householdService = householdService;
        this.taskSchedulingService = taskSchedulingService;
    }

    @Override
    protected void doAppFilter(Jwt jwt) {
        if (isNoHouseholdBoundToJwt(jwt)) {
            log.debug("The filter won't be triggered because the household of the Keycloak User {} isn't set up yet.",
                    jwt.getSubject());
            return;
        }
        Household household = this.householdService.getHouseholdByJwt(jwt);
        this.taskSchedulingService.updateAllTaskSchedulingParametersByHousehold(household);
    }

    private boolean isNoHouseholdBoundToJwt(Jwt jwt) {
        return !householdService.isHouseholdBoundToJwt(jwt);
    }
}
