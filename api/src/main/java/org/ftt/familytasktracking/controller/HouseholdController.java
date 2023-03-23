package org.ftt.familytasktracking.controller;

import org.ftt.familytasktracking.dtos.HouseholdRequestDto;
import org.ftt.familytasktracking.dtos.HouseholdResponseDto;
import org.ftt.familytasktracking.services.HouseholdService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

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

    /**
     * Creates a household with the JWT
     *
     * @param request {@link HouseholdRequestDto} to create a {@link org.ftt.familytasktracking.entities.Household} with
     * @param jwt {@link Jwt} that is automatically sent and fetched by the {@link AuthenticationPrincipal}
     * @return {@link ResponseEntity} with the {@link HouseholdResponseDto}
     */
    @PostMapping
    public ResponseEntity<HouseholdResponseDto> createHouseholdByJwt(@RequestBody HouseholdRequestDto request,
                                                                     @AuthenticationPrincipal Jwt jwt) {
        // TODO: When Creating a Household, a Profile should be created with it?
        HouseholdResponseDto response = this.householdService.createHouseholdByRequest(jwt, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Updates a household with the JWT
     *
     * @param request {@link HouseholdRequestDto} to update a {@link org.ftt.familytasktracking.entities.Household} with
     * @param jwt {@link Jwt} that is automatically sent and fetched by the {@link AuthenticationPrincipal}
     * @return {@link ResponseEntity} with the {@link HouseholdResponseDto}
     */
    @PutMapping
    public ResponseEntity<HouseholdResponseDto> updateHouseholdByJwt(@RequestBody HouseholdRequestDto request,
                                                                     @AuthenticationPrincipal Jwt jwt) {
        HouseholdResponseDto response = this.householdService.updateHouseholdByRequest(jwt, request);
        return ResponseEntity.ok(response);
    }
}
