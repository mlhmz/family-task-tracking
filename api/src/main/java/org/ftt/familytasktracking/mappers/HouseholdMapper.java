package org.ftt.familytasktracking.mappers;

import org.ftt.familytasktracking.dtos.HouseholdRequestDto;
import org.ftt.familytasktracking.dtos.HouseholdResponseDto;
import org.ftt.familytasktracking.entities.Household;
import org.mapstruct.Mapper;

/**
 * Mapper for the {@link Household} and {@link HouseholdResponseDto} Object.
 */
@Mapper
public interface HouseholdMapper extends DefaultMapper {
    /**
     * Maps a {@link Household}-Entity to a {@link HouseholdResponseDto}.
     * The keycloakUserId will be ignored.
     *
     * @param household {@link Household} to map
     * @return Mapped {@link HouseholdResponseDto}
     */
    HouseholdResponseDto mapHouseholdToHouseholdResponseDto(Household household);

    /**
     * Maps a {@link HouseholdRequestDto} to a {@link Household}-Entity
     *
     * @param dto {@link HouseholdResponseDto} to map
     * @return Mapped {@link Household}
     */
    Household mapHouseholdRequestDtoToHousehold(HouseholdRequestDto dto);
}
