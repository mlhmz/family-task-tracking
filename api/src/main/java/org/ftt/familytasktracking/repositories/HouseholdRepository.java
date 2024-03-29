package org.ftt.familytasktracking.repositories;

import org.ftt.familytasktracking.entities.Household;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface HouseholdRepository extends JpaRepository<Household, UUID> {
    Optional<Household> getHouseholdByKeycloakUserId(UUID uuid);
    boolean existsHouseholdByKeycloakUserId(UUID keycloakUserId);
}
