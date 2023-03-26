package org.ftt.familytasktracking.repositories;

import org.ftt.familytasktracking.entities.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for the Profile entity.
 */
public interface ProfileRepository extends JpaRepository<Profile, UUID> {
    @Query("select p from Profile p where p.household.keycloakUserId = ?1")
    List<Profile> findAllByKeycloakUserId(UUID keycloakUserId);
    @Query("select p from Profile p where p.household.keycloakUserId = ?1 and p.uuid = ?2")
    Optional<Profile> findByKeycloakUserIdAndUuid(UUID keycloakUserId, UUID profileUuid);
    @Query("select (count(p) > 0) from Profile p where p.household.keycloakUserId = ?1 and p.uuid = ?2")
    boolean existsByKeycloakUserIdAndUuid(UUID keycloakUserId, UUID profileUuid);
}
