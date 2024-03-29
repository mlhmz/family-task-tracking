package org.ftt.familytasktracking.mappers;

import org.ftt.familytasktracking.dtos.ProfileRequestDto;
import org.ftt.familytasktracking.dtos.ProfileResponseDto;
import org.ftt.familytasktracking.entities.Profile;
import org.mapstruct.*;

/**
 * Mapper for the {@link Profile} and {@link ProfileResponseDto} Object.
 */
@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface ProfileMapper {
    /**
     * Maps a {@link Profile}-Entity to a {@link ProfileResponseDto}.
     * The tasks field, as well as the password field will be ignored.
     * The passwordProtected Field will be mapped by checking if the password is null or empty
     *
     * @param profile {@link Profile} to map
     * @return Mapped {@link ProfileResponseDto}
     */
    @Mapping(
            expression = "java(profile.getPassword() != null && !profile.getPassword().equals(\"\"))",
            target = "passwordProtected"
    )
    ProfileResponseDto mapProfileToProfileDto(Profile profile);

    /**
     * Maps a {@link ProfileRequestDto} to a {@link Profile}-Entity.
     * The password as well as the tasks won't be mapped
     *
     * @param dto {@link ProfileRequestDto} to map
     * @return Mapped {@link Profile}
     */
    Profile mapProfileDtoToProfile(ProfileRequestDto dto);

    /**
     * Updates the {@link Profile}
     *
     * @param updateContent Content for Update
     * @param profile       Profile that is being updated
     */
    void updateProfileFromDto(Profile updateContent, @MappingTarget Profile profile);

    /**
     * Safe Updates the {@link Profile} for unprivileged Users
     *
     * @param updateContent Content for Update
     * @param profile       Profile that is being updated
     */
    @Mapping(target = "points", ignore = true)
    @Mapping(target = "permissionType", ignore = true)
    void safeUpdateProfileFromDto(Profile updateContent, @MappingTarget Profile profile);
}
