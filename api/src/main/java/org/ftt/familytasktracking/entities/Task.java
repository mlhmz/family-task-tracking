package org.ftt.familytasktracking.entities;

import jakarta.persistence.*;
import lombok.*;
import org.ftt.familytasktracking.enums.TaskState;
import org.ftt.familytasktracking.tasks.scheduler.SchedulerMode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Tasks for the {@link Household} members ({@link Profile})
 */
@Entity
@Table(name = "task")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID uuid;

    @Column(nullable = false)
    private String name;

    private String description;

    private Integer points;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime expirationAt;

    private LocalDateTime doneAt;

    private LocalDateTime lastTaskCreationAt;

    private LocalDateTime nextTaskCreationAt;

    private TaskState taskState;

    private SchedulerMode schedulerMode;

    private String cronExpression;

    private Long intervalMillis;

    @ManyToOne(targetEntity = Profile.class, fetch = FetchType.EAGER)
    private Profile assignee;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private Household household;

    @PrePersist
    @PreUpdate
    private void prePersist() {
        if (taskState == null) {
            taskState = TaskState.UNDONE;
        }
        if (schedulerMode == null) {
            schedulerMode = SchedulerMode.DEACTIVATED;
        }
        if (lastTaskCreationAt == null) {
            lastTaskCreationAt = LocalDateTime.now();
        }
    }
}
