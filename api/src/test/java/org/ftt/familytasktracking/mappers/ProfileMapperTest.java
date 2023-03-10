package org.ftt.familytasktracking.mappers;

import org.ftt.familytasktracking.dtos.ProfileDto;
import org.ftt.familytasktracking.entities.Household;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.enums.PermissionType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = "spring.main.lazy-initialization=true",
        classes = {ProfileMapperTest.class, ProfileMapperImpl.class})
class ProfileMapperTest {
    @Autowired
    ProfileMapper profileMapper;

    @ParameterizedTest
    @EnumSource(PermissionType.class)
    void mapProfileToProfileDto(PermissionType permissionType) {
        Profile profile = Profile.builder()
                .uuid(UUID.randomUUID())
                .name("Task 1")
                .points(100)
                .permissionType(permissionType)
                .password("1234")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .household(
                        Household.builder()
                                .uuid(UUID.randomUUID())
                                .build()
                ).build();
        ProfileDto profileDto = profileMapper.mapProfileToProfileDto(profile);
        assertThat(profileDto.uuid()).isEqualTo(profile.getUuid().toString());
        assertThat(profileDto.name()).isEqualTo(profile.getName());
        assertThat(profileDto.points()).isEqualTo(profile.getPoints());
        assertThat(profileDto.permissionType()).isEqualTo(profile.getPermissionType());
        assertThat(profileDto.createdAt()).isEqualTo(profile.getCreatedAt());
        assertThat(profileDto.updatedAt()).isEqualTo(profile.getUpdatedAt());
        assertThat(profileDto.householdUuid()).isEqualTo(profile.getHousehold().getUuid().toString());
    }

    @Test
    void mapProfileDtoToProfile() {
        ProfileDto profileDto = new ProfileDto(UUID.randomUUID().toString(), "Test", 100, PermissionType.ADMIN,
                LocalDateTime.now(), LocalDateTime.now(), UUID.randomUUID().toString());
        Profile profile = profileMapper.mapProfileDtoToProfile(profileDto);
        assertThat(profile.getUuid()).hasToString(profileDto.uuid());
        assertThat(profile.getName()).isEqualTo(profileDto.name());
        assertThat(profile.getPoints()).isEqualTo(profileDto.points());
        assertThat(profile.getPermissionType()).isEqualTo(profileDto.permissionType());
        assertThat(profile.getCreatedAt()).isEqualTo(profileDto.createdAt());
        assertThat(profile.getUpdatedAt()).isEqualTo(profileDto.updatedAt());
        assertThat(profile.getHousehold()).isNull();
        assertThat(profile.getTasks()).isNullOrEmpty();
    }
}