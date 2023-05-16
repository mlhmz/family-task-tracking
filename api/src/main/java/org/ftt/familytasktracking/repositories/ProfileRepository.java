package org.ftt.familytasktracking.repositories;

import com.querydsl.core.types.dsl.StringExpression;
import com.querydsl.core.types.dsl.StringPath;
import lombok.NonNull;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.entities.QProfile;
import org.ftt.familytasktracking.enums.PermissionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.querydsl.binding.QuerydslBinderCustomizer;
import org.springframework.data.querydsl.binding.QuerydslBindings;
import org.springframework.data.querydsl.binding.SingleValueBinding;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for the Profile entity.
 */
public interface ProfileRepository extends JpaRepository<Profile, UUID>,
        QuerydslPredicateExecutor<Profile>, QuerydslBinderCustomizer<QProfile> {
    @Override
    default void customize(QuerydslBindings bindings, @NonNull QProfile root) {
        bindings.bind(String.class)
                .first((SingleValueBinding<StringPath, String>) StringExpression::containsIgnoreCase);
    }

    @Query("select p from Profile p where p.household.keycloakUserId = ?1")
    List<Profile> findAllByKeycloakUserId(UUID keycloakUserId);

    @Query("select p from Profile p where p.household.keycloakUserId = ?1 and p.uuid = ?2")
    Optional<Profile> findByKeycloakUserIdAndUuid(UUID keycloakUserId, UUID profileUuid);

    @Query("select (count(p) > 0) from Profile p where p.household.keycloakUserId = ?1 and p.uuid = ?2")
    boolean existsByKeycloakUserIdAndUuid(UUID keycloakUserId, UUID profileUuid);

    @Query("select (count(p) > 0) from Profile p where p.household.keycloakUserId = ?1 and p.permissionType = ?2")
    boolean existsByKeycloakUserIdAndPermissionType(UUID keycloakUserId, PermissionType type);
}
