package org.ftt.familytasktracking.search;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.NumberPath;
import com.querydsl.core.types.dsl.PathBuilder;

/**
 * Implementation for {@link Integer}
 */
public class IntegerSearchQueryParser<U> implements SearchQueryParser<U> {
    @Override
    public BooleanExpression parseSearchQuery(SearchQuery query, PathBuilder<U> path) {
        Integer value = (Integer) query.value();
        NumberPath<Integer> numberPath = path.getNumber(query.key(), Integer.class);
        return switch (query.operation()) {
            case '<' -> numberPath.loe(value);
            case '>' -> numberPath.goe(value);
            case ':' -> numberPath.eq(value);
            default -> null;
        };
    }
}
