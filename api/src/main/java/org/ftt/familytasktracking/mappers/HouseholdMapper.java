package org.ftt.familytasktracking.mappers;

import org.ftt.familytasktracking.dtos.HouseholdDto;
import org.ftt.familytasktracking.entities.Household;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for the {@link Household} and {@link HouseholdDto} Object.
 */
@Mapper(componentModel = "spring")
public interface HouseholdMapper {
    /**
     * Maps a {@link Household}-Entity to a {@link HouseholdDto}.
     * The keycloakUserId will be ignored.
     *
     * @param household {@link Household} to map
     * @return Mapped {@link HouseholdDto}
     */
    HouseholdDto mapHouseholdToHouseholdDto(Household household);

    /**
     * Maps a {@link HouseholdDto} to a {@link Household}-Entity
     *
     * @param householdDto {@link HouseholdDto} to map
     * @return Mapped {@link Household}
     */
    @Mapping(target = "keycloakUserId", ignore = true)
    @Mapping(target = "profiles", ignore = true)
    @Mapping(target = "taskRoutines", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    Household mapHouseholdDtoToHousehold(HouseholdDto householdDto);
}
