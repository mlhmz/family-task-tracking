package org.ftt.familytasktracking.mappers;

import org.ftt.familytasktracking.dtos.HouseholdResponseDto;
import org.ftt.familytasktracking.entities.Household;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for the {@link Household} and {@link HouseholdResponseDto} Object.
 */
@Mapper(componentModel = "spring")
public interface HouseholdMapper {
    /**
     * Maps a {@link Household}-Entity to a {@link HouseholdResponseDto}.
     * The keycloakUserId will be ignored.
     *
     * @param household {@link Household} to map
     * @return Mapped {@link HouseholdResponseDto}
     */
    HouseholdResponseDto mapHouseholdToHouseholdDto(Household household);

    /**
     * Maps a {@link HouseholdResponseDto} to a {@link Household}-Entity
     *
     * @param householdResponseDto {@link HouseholdResponseDto} to map
     * @return Mapped {@link Household}
     */
    @Mapping(target = "keycloakUserId", ignore = true)
    @Mapping(target = "profiles", ignore = true)
    @Mapping(target = "taskRoutines", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    Household mapHouseholdDtoToHousehold(HouseholdResponseDto householdResponseDto);
}
