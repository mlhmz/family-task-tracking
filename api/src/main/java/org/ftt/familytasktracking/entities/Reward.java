package org.ftt.familytasktracking.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

/**
 * Reward
 */
@Entity
@Table(name = "reward")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reward {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID uuid;

    private Integer cost;

    private String name;

    private String description;

    private Boolean redeemed;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private Household household;

    @PrePersist
    @PreUpdate
    private void prePersist() {
        if (redeemed == null) {
            redeemed = false;
        }
    }

}
