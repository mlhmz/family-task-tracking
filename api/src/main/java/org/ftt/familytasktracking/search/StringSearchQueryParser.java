package org.ftt.familytasktracking.search;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.core.types.dsl.StringPath;

public class StringSearchQueryParser<U> implements SearchQueryParser<U> {
    @Override
    public BooleanExpression parseSearchQuery(SearchQuery query, PathBuilder<U> path) {
        String value = (String) query.value();
        StringPath stringPath = path.getString(value);
        return switch (query.operation()) {
            case ':' -> stringPath.contains(value);
            case '=' -> stringPath.eq(value);
            default -> null;
        };
    }
}
