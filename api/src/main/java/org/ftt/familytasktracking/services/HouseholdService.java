package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.dtos.HouseholdRequestDto;
import org.ftt.familytasktracking.dtos.HouseholdResponseDto;
import org.ftt.familytasktracking.entities.Household;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Optional;
import java.util.UUID;

/**
 * Service-Interface for all Household Processes
 */
public interface HouseholdService {
    HouseholdResponseDto getHouseholdResponseByJwt(Jwt jwt);

    Optional<Household> getHouseholdByJwt(Jwt jwt);

    HouseholdResponseDto getHouseholdResponseByKeycloakUserId(UUID keycloakUserId);

    Optional<Household> getHouseholdByKeycloakUserId(UUID keycloakUserId);

    HouseholdResponseDto createHouseholdByRequest(Jwt jwt, HouseholdRequestDto householdRequestDto);

    HouseholdResponseDto updateHouseholdByRequest(Jwt jwt, HouseholdRequestDto householdRequestDto);

    Household saveHousehold(Household household);
}
