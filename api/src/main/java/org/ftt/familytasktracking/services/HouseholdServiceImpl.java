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

    @Override
    public HouseholdResponseDto getHouseholdResponseByJwt(Jwt jwt) {
        UUID keycloakUserId = this.keycloakService.getKeycloakUserId(jwt);
        return getHouseholdResponseByKeycloakUserId(keycloakUserId);
    }

    @Override
    public HouseholdResponseDto getHouseholdResponseByKeycloakUserId(UUID keycloakUserId) {
        Optional<Household> household = getHouseholdByKeycloakUserId(keycloakUserId);
        if (household.isEmpty()) {
            throw new HouseholdAlreadyExistingException();
        }
        return this.householdMapper.mapHouseholdToHouseholdResponseDto(household.get());
    }

    @Override
    public Optional<Household> getHouseholdByJwt(Jwt jwt) {
        UUID keycloakUserId = this.keycloakService.getKeycloakUserId(jwt);
        return getHouseholdByKeycloakUserId(keycloakUserId);
    }

    public Optional<Household> getHouseholdByKeycloakUserId(UUID keycloakUserId) {
        return this.householdRepository.getHouseholdByKeycloakUserId(keycloakUserId);
    }

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

    @Override
    public Household saveHousehold(Household household) {
        return this.householdRepository.save(household);
    }
}
