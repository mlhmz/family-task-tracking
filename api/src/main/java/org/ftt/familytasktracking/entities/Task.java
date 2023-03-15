package org.ftt.familytasktracking.entities;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
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

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime expirationAt;

    private LocalDateTime doneAt;

    @Builder.Default
    private boolean done = false;

    @ManyToOne(targetEntity = Household.class, fetch = FetchType.EAGER, optional = false)
    private Household household;

    @ManyToOne(targetEntity = Profile.class, fetch = FetchType.EAGER)
    private Profile assignee;
}
