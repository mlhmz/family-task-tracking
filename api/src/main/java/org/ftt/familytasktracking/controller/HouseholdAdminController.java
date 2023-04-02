package org.ftt.familytasktracking.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.ftt.familytasktracking.dtos.HouseholdRequestDto;
import org.ftt.familytasktracking.dtos.HouseholdResponseDto;
import org.ftt.familytasktracking.exceptions.ErrorDetails;
import org.ftt.familytasktracking.services.HouseholdService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for Handling Household related Stuff for Admins
 */
@RestController
@RequestMapping("/api/v1/admin/household")
public class HouseholdAdminController {
    private final HouseholdService householdService;

    public HouseholdAdminController(HouseholdService householdService) {
        this.householdService = householdService;
    }

    /**
     * Creates a household with the JWT
     *
     * @param request {@link HouseholdRequestDto} to create a {@link org.ftt.familytasktracking.entities.Household} with
     * @param jwt     {@link Jwt} that is automatically sent and fetched by the {@link AuthenticationPrincipal}
     * @return {@link ResponseEntity} with the {@link HouseholdResponseDto}
     */
    @Operation(summary = "Creates a Household by its Keycloak-User-Id which is identified by the Authorization-Token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Created Household",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = HouseholdResponseDto.class))}),
            @ApiResponse(responseCode = "400", description = "User is already bound to a household or " +
                    "Invalid JSON submitted",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "401", description = "Request doesn't contain a valid bearer token or " +
                    "User is already set up and Session ID is not valid",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "403", description = "The profile trying to modify this resource " +
                    "is unprivileged",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
    })
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<HouseholdResponseDto> createHouseholdByJwt(@RequestBody HouseholdRequestDto request,
                                                                     @AuthenticationPrincipal Jwt jwt) {
        HouseholdResponseDto response = this.householdService.createHouseholdByRequest(jwt, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Updates a household with the JWT
     *
     * @param request {@link HouseholdRequestDto} to update a {@link org.ftt.familytasktracking.entities.Household} with
     * @param jwt     {@link Jwt} that is automatically sent and fetched by the {@link AuthenticationPrincipal}
     * @return {@link ResponseEntity} with the {@link HouseholdResponseDto}
     */
    @Operation(summary = "Updates a Household by its Keycloak-User-Id which is identified by the Authorization-Token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found Household and updated it",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = HouseholdResponseDto.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid JSON submitted",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "401", description = "Request doesn't contain a valid bearer token or " +
                    "Session ID is not valid",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "403", description = "The profile trying to modify this resource " +
                    "is unprivileged",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "404", description = "There is no household bound to the Keycloak User",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
    }
    )
    @PutMapping
    public ResponseEntity<HouseholdResponseDto> updateHouseholdByJwt(@RequestBody HouseholdRequestDto request,
                                                                     @AuthenticationPrincipal Jwt jwt) {
        HouseholdResponseDto response = this.householdService.updateHouseholdByRequest(jwt, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Deletes a household that is bound to the jwt and returns Returns {@link HttpStatus#NO_CONTENT}
     *
     * @param jwt {@link Jwt} that is automatically sent and fetched by the {@link AuthenticationPrincipal}
     */
    @Operation(summary = "Deletes a Household by its Keycloak-User-Id which is identified by the Authorization-Token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Found and deleted Household",
                    content = {@Content(mediaType = "application/json")}),
            @ApiResponse(responseCode = "400", description = "Invalid JSON submitted",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "401", description = "Request doesn't contain a valid bearer token or " +
                    "Session ID is not valid",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "403", description = "The profile trying to delete this resource " +
                    "is unprivileged",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "404", description = "There is no household bound to the Keycloak User",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
    }
    )
    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteHouseholdByJwt(@AuthenticationPrincipal Jwt jwt) {
        this.householdService.deleteHouseholdByJwt(jwt);
    }
}
