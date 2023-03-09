package org.ftt.familytasktracking.entities;

import lombok.*;
import org.ftt.familytasktracking.enums.PermissionType;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

/**
 * Profiles are the entities for members in a {@link Household}.
 */
@Entity
@Table(name = "profile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID uuid;

    @Column(nullable = false)
    private String name;

    private int points;

    @Column(nullable = false)
    private PermissionType permissionType = PermissionType.MEMBER;

    @Column(nullable = false)
    private String password;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne(targetEntity = Household.class, fetch = FetchType.EAGER)
    private Household household;

    @OneToMany(mappedBy = "assignee", targetEntity = Task.class, fetch = FetchType.LAZY)
    private Set<Task> tasks;
}
