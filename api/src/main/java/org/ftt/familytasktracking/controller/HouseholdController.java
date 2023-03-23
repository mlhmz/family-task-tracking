package org.ftt.familytasktracking.controller;

import org.ftt.familytasktracking.dtos.HouseholdRequestDto;
import org.ftt.familytasktracking.dtos.HouseholdResponseDto;
import org.ftt.familytasktracking.services.HouseholdService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/household")
public class HouseholdController {
    private final HouseholdService householdService;

    public HouseholdController(HouseholdService householdService) {
        this.householdService = householdService;
    }

    @GetMapping
    public ResponseEntity<HouseholdResponseDto> getHouseholdByJwt(@AuthenticationPrincipal Jwt jwt) {
        HouseholdResponseDto response = this.householdService.getHouseholdResponseByJwt(jwt);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<HouseholdResponseDto> createHouseholdByJwt(@RequestBody HouseholdRequestDto request,
                                                                     @AuthenticationPrincipal Jwt jwt) {
        HouseholdResponseDto response = this.householdService.createHouseholdByRequest(jwt, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<HouseholdResponseDto> updateHouseholdByJwt(@RequestBody HouseholdRequestDto request,
                                                                     @AuthenticationPrincipal Jwt jwt) {
        HouseholdResponseDto response = this.householdService.updateHouseholdByRequest(jwt, request);
        return ResponseEntity.ok(response);
    }
}
