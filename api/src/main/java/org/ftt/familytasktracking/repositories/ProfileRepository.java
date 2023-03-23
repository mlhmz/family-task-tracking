package org.ftt.familytasktracking.repositories;

import org.ftt.familytasktracking.entities.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProfileRepository extends JpaRepository<Profile, UUID> {
    Profile getProfileByUuid(UUID uuid);
}
