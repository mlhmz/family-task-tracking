package org.ftt.familytasktracking.dtos;

public record TaskRequestDto(
    String name,
    String description,
    boolean done,
    String assigneeUuid
) {}
