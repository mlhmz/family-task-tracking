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
    /**
     * Gets a household by the linked Keycloak User to it that is identified by the jwt
     *
     * @param jwt {@link Jwt} of the Keycloak User
     * @return {@link Household} that the user is linked to
     */
    HouseholdResponseDto getHouseholdResponseByJwt(Jwt jwt);

    Optional<Household> getHouseholdByJwt(Jwt jwt);

    HouseholdResponseDto getHouseholdResponseByKeycloakUserId(UUID keycloakUserId);

    /**
     * Creates a Household, if a household already exists, it wont be created
     *
     * @param jwt                 of the household / that should be created with the household
     * @param householdRequestDto Household Entity that should be saved
     * @return {@link Household} as callback
     */
    HouseholdResponseDto createHouseholdByRequest(Jwt jwt, HouseholdRequestDto householdRequestDto);

    HouseholdResponseDto updateHouseholdByRequest(Jwt jwt, HouseholdRequestDto householdRequestDto);

    Household saveHousehold(Household household);
}
