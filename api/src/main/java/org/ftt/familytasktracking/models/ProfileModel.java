package org.ftt.familytasktracking.models;

import org.ftt.familytasktracking.dtos.ProfileRequestDto;
import org.ftt.familytasktracking.dtos.ProfileResponseDto;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.mappers.ProfileMapper;

public class ProfileModel implements Model<Profile, ProfileResponseDto> {
    private final ProfileMapper profileMapper;
    private final Profile profile;

    public ProfileModel(Profile profile, ProfileMapper profileMapper) {
        this.profile = profile;
        this.profileMapper = profileMapper;
    }

    public ProfileModel(ProfileRequestDto dto, ProfileMapper profileMapper) {
        this.profileMapper = profileMapper;
        this.profile = profileMapper.mapProfileDtoToProfile(dto);
    }

    @Override
    public ProfileResponseDto toResponseDto() {
        return this.profileMapper.mapProfileToProfileDto(this.profile);
    }

    @Override
    public Profile toEntity() {
        return this.profile;
    }
}
