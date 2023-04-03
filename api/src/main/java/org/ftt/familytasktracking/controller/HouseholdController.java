package org.ftt.familytasktracking.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.ftt.familytasktracking.dtos.HouseholdResponseDto;
import org.ftt.familytasktracking.exceptions.ErrorDetails;
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
    @Operation(summary = "Gets a Household by its Keycloak-User-Id which is identified by the Authorization-Token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Household found",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = HouseholdResponseDto.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid JSON submitted",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "401", description = "Request doesn't contain a valid bearer token",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "404", description = "There is no household bound to the Keycloak User",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}
            )}
    )
    @GetMapping
    public ResponseEntity<HouseholdResponseDto> getHouseholdByJwt(@AuthenticationPrincipal Jwt jwt) {
        HouseholdResponseDto response = this.householdService.getHouseholdResponseByJwt(jwt);
        return ResponseEntity.ok(response);
    }
}
