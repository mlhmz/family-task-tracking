package org.ftt.familytasktracking.mappers;

import org.ftt.familytasktracking.dtos.HouseholdRequestDto;
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
    void mapHouseholdToHouseholdResponseDto() {
        Household household = Household.builder()
                .uuid(UUID.randomUUID())
                .householdName("Test")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        HouseholdResponseDto householdResponseDto = householdMapper.mapHouseholdToHouseholdResponseDto(household);
        assertThat(householdResponseDto.uuid()).isEqualTo(household.getUuid().toString());
        assertThat(householdResponseDto.householdName()).isEqualTo(household.getHouseholdName());
        assertThat(householdResponseDto.createdAt()).isEqualTo(household.getCreatedAt());
        assertThat(householdResponseDto.updatedAt()).isEqualTo(household.getUpdatedAt());
    }

    @Test
    void mapHouseholdRequestDtoToHousehold() {
        HouseholdRequestDto dto = new HouseholdRequestDto("Test");
        Household household = householdMapper.mapHouseholdRequestDtoToHousehold(dto);
        assertThat(household.getHouseholdName()).isEqualTo(dto.householdName());
    }
}