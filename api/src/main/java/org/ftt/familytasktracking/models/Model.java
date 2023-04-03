package org.ftt.familytasktracking.models;

/**
 * Domain Model Object that represents an entity.
 * <p>
 * It makes the handling between the Controllers and Services easier by
 * offering the Data as Dto and as Entity
 *
 * @param <T> Actual Entity Object
 * @param <U> Representative Object (DTO)
 */
public interface Model<T, U> {
    /**
     * Gets the Entity from the {@link Model}
     *
     * @return {@link T} that is the actual entity
     */
    T toEntity();

    /**
     * Maps the inner Entity to the Response Dto
     *
     * @return {@link U} that represents the Entity
     */
    U toResponseDto();
}
