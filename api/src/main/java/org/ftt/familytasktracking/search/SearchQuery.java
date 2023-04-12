package org.ftt.familytasktracking.search;

/**
 * Parsed Objects for SearchQueries
 *
 * @param key       Actual key of an entity field
 * @param operation Query Operation like equals
 * @param value     Value of the Query that is searched with
 */
public record SearchQuery(
        String key,
        Character operation,
        Object value
) {
}
