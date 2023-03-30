package org.ftt.familytasktracking.models;

/**
 * Domain Model Object that stores the Entity and offers convert Methods
 *
 * @param <T> Actual Entity Object
 * @param <U> Dto Object
 */
public interface Model<T, U> {
    T toEntity();

    U toResponseDto();
}
