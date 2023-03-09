package org.ftt.familytasktracking.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskRoutineDto {
    private String uuid;

    private String name;

    private String description;

    private String interval;

    private String intervalType;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime lastTaskCreationAt;

    private boolean activated;

    private String householdUuid;
}
