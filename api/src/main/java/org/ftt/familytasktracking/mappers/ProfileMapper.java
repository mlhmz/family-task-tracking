package org.ftt.familytasktracking.mappers;

import org.ftt.familytasktracking.dtos.ProfileDto;
import org.ftt.familytasktracking.entities.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for the {@link Profile} and {@link ProfileDto} Object.
 */
@Mapper(componentModel = "spring")
public interface ProfileMapper {
    /**
     * Maps a {@link Profile}-Entity to a {@link ProfileDto}.
     * The household will be mapped to a specific householdUuid.
     * The tasks field, as well as the password field will be ignored.
     *
     * @param profile {@link Profile} to map
     * @return Mapped {@link ProfileDto}
     */
    @Mapping(target = "householdUuid", source = "household.uuid")
    ProfileDto mapProfileToProfileDto(Profile profile);

    /**
     * Maps a {@link ProfileDto} to a {@link Profile}-Entity.
     * The householdUuid will not get mapped.
     *
     * @param profileDto {@link ProfileDto} to map
     * @return Mapped {@link Profile}
     */
    @Mapping(target = "household", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    Profile mapProfileDtoToProfile(ProfileDto profileDto);

}
