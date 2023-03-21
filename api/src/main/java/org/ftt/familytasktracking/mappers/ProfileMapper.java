package org.ftt.familytasktracking.mappers;

import org.ftt.familytasktracking.dtos.ProfileRequestDto;
import org.ftt.familytasktracking.dtos.ProfileResponseDto;
import org.ftt.familytasktracking.entities.Profile;
import org.mapstruct.Mapper;

/**
 * Mapper for the {@link Profile} and {@link ProfileResponseDto} Object.
 */
@Mapper
public interface ProfileMapper extends DefaultMapper {
    /**
     * Maps a {@link Profile}-Entity to a {@link ProfileResponseDto}.
     * The tasks field, as well as the password field will be ignored.
     *
     * @param profile {@link Profile} to map
     * @return Mapped {@link ProfileResponseDto}
     */
    ProfileResponseDto mapProfileToProfileDto(Profile profile);

    /**
     * Maps a {@link ProfileRequestDto} to a {@link Profile}-Entity.
     * The password as well as the tasks won't be mapped
     *
     * @param dto {@link ProfileRequestDto} to map
     * @return Mapped {@link Profile}
     */
    Profile mapProfileDtoToProfile(ProfileRequestDto dto);

}
