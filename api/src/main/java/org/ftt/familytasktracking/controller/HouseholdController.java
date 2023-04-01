package org.ftt.familytasktracking.controller;

import org.ftt.familytasktracking.dtos.HouseholdResponseDto;
import org.ftt.familytasktracking.services.HouseholdService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for Handling Household related Stuff
 */
@RestController
@RequestMapping("/api/v1/household")
public class HouseholdController {
    private final HouseholdService householdService;

    public HouseholdController(HouseholdService householdService) {
        this.householdService = householdService;
    }

    /**
     * Gets a household by the JWT
     *
     * @param jwt {@link Jwt} that is automatically sent and fetched by the {@link AuthenticationPrincipal}
     * @return {@link ResponseEntity} with the {@link HouseholdResponseDto}
     */
    @GetMapping
    public ResponseEntity<HouseholdResponseDto> getHouseholdByJwt(@AuthenticationPrincipal Jwt jwt) {
        HouseholdResponseDto response = this.householdService.getHouseholdResponseByJwt(jwt);
        return ResponseEntity.ok(response);
    }
}
