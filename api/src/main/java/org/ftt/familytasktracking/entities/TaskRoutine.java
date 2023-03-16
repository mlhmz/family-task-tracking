package org.ftt.familytasktracking.entities;

import lombok.*;
import org.ftt.familytasktracking.enums.IntervalType;
import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * TaskRoutine-Template for reoccurring {@link Task}'s
 */
@Entity
@Table(name = "task_routine")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskRoutine {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID uuid;

    private String name;

    private String description;

    @Min(1)
    private int interval;

    private IntervalType intervalType;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime lastTaskCreationAt;

    private boolean activated;
}
