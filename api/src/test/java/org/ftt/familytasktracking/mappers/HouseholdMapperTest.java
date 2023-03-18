package org.ftt.familytasktracking.mappers;

import org.ftt.familytasktracking.dtos.HouseholdResponseDto;
import org.ftt.familytasktracking.entities.Household;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = "spring.main.lazy-initialization=true",
        classes = {HouseholdMapperTest.class, HouseholdMapperImpl.class})
class HouseholdMapperTest {
    @Autowired
    HouseholdMapper householdMapper;

    @Test
    void mapHouseholdToHouseholdDto() {
        Household household = Household.builder()
                .uuid(UUID.randomUUID())
                .householdName("Test")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        HouseholdResponseDto householdResponseDto = householdMapper.mapHouseholdToHouseholdDto(household);
        assertThat(householdResponseDto.uuid()).isEqualTo(household.getUuid().toString());
        assertThat(householdResponseDto.householdName()).isEqualTo(household.getHouseholdName());
        assertThat(householdResponseDto.createdAt()).isEqualTo(household.getCreatedAt());
        assertThat(householdResponseDto.updatedAt()).isEqualTo(household.getUpdatedAt());
    }

    @Test
    void mapHouseholdDtoToHousehold() {
        HouseholdResponseDto dto = new HouseholdResponseDto(UUID.randomUUID().toString(), "Test",
                LocalDateTime.now(), LocalDateTime.now());
        Household household = householdMapper.mapHouseholdDtoToHousehold(dto);
        assertThat(household.getUuid()).hasToString(dto.uuid());
        assertThat(household.getHouseholdName()).isEqualTo(dto.householdName());
        assertThat(household.getCreatedAt()).isEqualTo(dto.createdAt());
        assertThat(household.getUpdatedAt()).isEqualTo(dto.updatedAt());
    }
}