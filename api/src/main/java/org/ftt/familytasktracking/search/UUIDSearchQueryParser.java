package org.ftt.familytasktracking.search;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.ComparablePath;
import com.querydsl.core.types.dsl.PathBuilder;

import java.util.UUID;

public class UUIDSearchQueryParser<U> implements SearchQueryParser<U> {
    @Override
    public BooleanExpression parseSearchQuery(SearchQuery query, PathBuilder<U> path) {
        UUID uuid = (UUID) query.value();
        ComparablePath<UUID> uuidPath = path.getComparable(query.key(), UUID.class);
        return query.operation() == ':' ? uuidPath.eq(uuid) : null;
    }
}
