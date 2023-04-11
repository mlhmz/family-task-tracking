package org.ftt.familytasktracking.search;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.PathBuilder;

import java.util.UUID;

public class UUIDSearchQueryParser<U> implements SearchQueryParser<U> {
    @Override
    public BooleanExpression parseSearchQuery(SearchQuery query, PathBuilder<U> path) {
        UUID uuid = (UUID) query.value();
        return new StringSearchQueryParser<U>().parseSearchQuery(
                new SearchQuery(query.key(), query.operation(), uuid.toString()),
                path
        );
    }
}
