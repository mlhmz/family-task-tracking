package org.ftt.familytasktracking.mappers;

import org.ftt.familytasktracking.dtos.ProfileResponseDto;
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
                .build();
        ProfileResponseDto profileResponseDto = profileMapper.mapProfileToProfileDto(profile);
        assertThat(profileResponseDto.uuid()).isEqualTo(profile.getUuid().toString());
        assertThat(profileResponseDto.name()).isEqualTo(profile.getName());
        assertThat(profileResponseDto.points()).isEqualTo(profile.getPoints());
        assertThat(profileResponseDto.permissionType()).isEqualTo(profile.getPermissionType());
        assertThat(profileResponseDto.createdAt()).isEqualTo(profile.getCreatedAt());
        assertThat(profileResponseDto.updatedAt()).isEqualTo(profile.getUpdatedAt());
    }

    @Test
    void mapProfileDtoToProfile() {
        ProfileResponseDto profileResponseDto = new ProfileResponseDto(UUID.randomUUID().toString(), "Test", 100, PermissionType.ADMIN,
                LocalDateTime.now(), LocalDateTime.now());
        Profile profile = profileMapper.mapProfileDtoToProfile(profileResponseDto);
        assertThat(profile.getUuid()).hasToString(profileResponseDto.uuid());
        assertThat(profile.getName()).isEqualTo(profileResponseDto.name());
        assertThat(profile.getPoints()).isEqualTo(profileResponseDto.points());
        assertThat(profile.getPermissionType()).isEqualTo(profileResponseDto.permissionType());
        assertThat(profile.getCreatedAt()).isEqualTo(profileResponseDto.createdAt());
        assertThat(profile.getUpdatedAt()).isEqualTo(profileResponseDto.updatedAt());
        assertThat(profile.getTasks()).isNullOrEmpty();
    }
}