package org.ftt.familytasktracking.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskDto {
    private String uuid;

    private String name;

    private String description;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime expirationAt;

    private LocalDateTime doneAt;

    private boolean done;

    private String assigneeUuid;

    private String householdUuid;
}
