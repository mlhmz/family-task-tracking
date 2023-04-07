package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.dtos.HouseholdRequestDto;
import org.ftt.familytasktracking.dtos.HouseholdResponseDto;
import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.exceptions.WebRtException;
import org.ftt.familytasktracking.mappers.HouseholdMapper;
import org.ftt.familytasktracking.repositories.HouseholdRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;
import java.util.function.Supplier;

/**
 * Service-Implementation of the {@link HouseholdService}
 */
@Service
public class HouseholdServiceImpl implements HouseholdService {
    private final HouseholdRepository householdRepository;
    private final HouseholdMapper householdMapper;
    private final KeycloakService keycloakService;

    public HouseholdServiceImpl(HouseholdRepository householdRepository, HouseholdMapper householdMapper,
                                KeycloakService keycloakService) {
        this.householdRepository = householdRepository;
        this.householdMapper = householdMapper;
        this.keycloakService = keycloakService;
    }

    /**
     * Gets a household by the JWT of the linked Keycloak User
     *
     * @param jwt {@link Jwt} of the Keycloak User which contains the keycloakUserId as a subject
     * @return {@link HouseholdResponseDto} that the user is linked to
     * @throws WebRtException with a {@link HttpStatus#NOT_FOUND} if the household doesn't exist
     */
    @Override
    public HouseholdResponseDto getHouseholdResponseByJwt(Jwt jwt) {
        UUID keycloakUserId = this.keycloakService.getKeycloakUserId(jwt);
        return getHouseholdResponseByKeycloakUserId(keycloakUserId);
    }

    /**
     * Gets a household by the Keycloak User ID of a certain user
     *
     * @param keycloakUserId UUID of the Household
     * @return {@link HouseholdResponseDto} of the Keycloak User
     * @throws WebRtException with a {@link HttpStatus#NOT_FOUND} if the household doesn't exist
     */
    @Override
    public HouseholdResponseDto getHouseholdResponseByKeycloakUserId(UUID keycloakUserId) {
        return this.householdMapper.mapHouseholdToHouseholdResponseDto(getHouseholdByKeycloakUserId(keycloakUserId));
    }

    /**
     * Gets a household by the JWT of the linked Keycloak User
     *
     * @param jwt {@link Jwt} of the Keycloak User which contains the keycloakUserId as a subject
     * @return {@link Household} that the user is linked to
     */
    @Override
    public Household getHouseholdByJwt(Jwt jwt) {
        UUID keycloakUserId = this.keycloakService.getKeycloakUserId(jwt);
        return getHouseholdByKeycloakUserId(keycloakUserId);
    }

    /**
     * Gets a household by the Keycloak User ID of a certain user
     *
     * @param keycloakUserId UUID of the Household
     * @return {@link Household} of the Keycloak User
     */
    @Override
    public Household getHouseholdByKeycloakUserId(UUID keycloakUserId) {
        Optional<Household> household = this.householdRepository.getHouseholdByKeycloakUserId(keycloakUserId);
        return household.orElseThrow(getNoHouseholdFoundRtException());
    }

    /**
     * Creates a Household, if a household already exists, it won't be created
     *
     * @param jwt                 of the household / that should be created with the household
     * @param householdRequestDto Household Entity that should be saved
     * @return {@link Household} as callback
     */
    @Override
    public HouseholdResponseDto createHouseholdByRequest(Jwt jwt, HouseholdRequestDto householdRequestDto) {
        UUID keycloakUserId = this.keycloakService.getKeycloakUserId(jwt);
        if (this.householdRepository.existsHouseholdByKeycloakUserId(keycloakUserId)) {
            throw new WebRtException(HttpStatus.BAD_REQUEST, "The user is already bound to a household.");
        }
        Household household = this.householdMapper.mapHouseholdRequestDtoToHousehold(householdRequestDto);
        household.setKeycloakUserId(keycloakUserId);
        Household savedHousehold = saveHousehold(household);
        return this.householdMapper.mapHouseholdToHouseholdResponseDto(savedHousehold);
    }

    /**
     * Updates a household with a {@link HouseholdRequestDto}-Object
     *
     * @param jwt                 {@link Jwt} that the Household is identified with
     * @param householdRequestDto Dto with which the Household is updated with
     * @return Updated {@link HouseholdResponseDto}-Object
     * @throws WebRtException with a {@link HttpStatus#NOT_FOUND} if the household doesn't exist
     */
    @Override
    public HouseholdResponseDto updateHouseholdByRequest(Jwt jwt, HouseholdRequestDto householdRequestDto) {
        Household updatedHousehold = this.householdMapper.updateHouseholdByHouseholdRequestDto(
                householdRequestDto, this.getHouseholdByJwt(jwt)
        );
        this.saveHousehold(updatedHousehold);
        return this.householdMapper.mapHouseholdToHouseholdResponseDto(updatedHousehold);
    }

    /**
     * Saves a household into the repository
     *
     * @param household {@link Household} to save
     * @return Saved {@link Household}
     */
    @Override
    public Household saveHousehold(Household household) {
        return this.householdRepository.save(household);
    }

    /**
     * Deletes a household
     *
     * @param jwt {@link Jwt} of the household
     * @throws WebRtException with {@link HttpStatus#NOT_FOUND} when the Household
     */
    @Override
    public void deleteHouseholdByJwt(Jwt jwt) {
        this.householdRepository.delete(this.getHouseholdByJwt(jwt));
    }

    @Override
    public boolean isHouseholdBoundToJwt(Jwt jwt) {
        UUID keycloakUserId = this.keycloakService.getKeycloakUserId(jwt);
        return this.householdRepository.existsHouseholdByKeycloakUserId(keycloakUserId);
    }

    private Supplier<WebRtException> getNoHouseholdFoundRtException() {
        return () -> new WebRtException(HttpStatus.NOT_FOUND, "The keycloak user doesn't have a household");
    }
}
