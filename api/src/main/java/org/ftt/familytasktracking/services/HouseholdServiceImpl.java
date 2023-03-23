package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.dtos.HouseholdRequestDto;
import org.ftt.familytasktracking.dtos.HouseholdResponseDto;
import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.exceptions.ObjectNotFoundException;
import org.ftt.familytasktracking.exceptions.HouseholdAlreadyExistingException;
import org.ftt.familytasktracking.mappers.HouseholdMapper;
import org.ftt.familytasktracking.repositories.HouseholdRepository;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

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
     * @throws ObjectNotFoundException if the household doesn't exist
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
     * @throws ObjectNotFoundException if the household doesn't exist
     */
    @Override
    public HouseholdResponseDto getHouseholdResponseByKeycloakUserId(UUID keycloakUserId) {
        Optional<Household> household = getHouseholdByKeycloakUserId(keycloakUserId);
        if (household.isEmpty()) {
            throw new ObjectNotFoundException();
        }
        return this.householdMapper.mapHouseholdToHouseholdResponseDto(household.get());
    }

    /**
     * Gets a household by the JWT of the linked Keycloak User
     *
     * @param jwt {@link Jwt} of the Keycloak User which contains the keycloakUserId as a subject
     * @return {@link Household} that the user is linked to
     */
    @Override
    public Optional<Household> getHouseholdByJwt(Jwt jwt) {
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
    public Optional<Household> getHouseholdByKeycloakUserId(UUID keycloakUserId) {
        return this.householdRepository.getHouseholdByKeycloakUserId(keycloakUserId);
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
            throw new HouseholdAlreadyExistingException();
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
     */
    @Override
    public HouseholdResponseDto updateHouseholdByRequest(Jwt jwt, HouseholdRequestDto householdRequestDto) {
        Optional<Household> household = this.getHouseholdByJwt(jwt);
        if (household.isEmpty()) {
            throw new ObjectNotFoundException();
        }
        Household updatedHousehold = this.householdMapper.updateHouseholdByHouseholdRequestDto(
                householdRequestDto, household.get()
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
}
