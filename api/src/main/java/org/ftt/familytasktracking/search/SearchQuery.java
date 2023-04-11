package org.ftt.familytasktracking.search;

public record SearchQuery(
        String key,
        Character operation,
        Object value
) {
}
