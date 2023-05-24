package org.ftt.familytasktracking.search;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.EnumPath;
import com.querydsl.core.types.dsl.PathBuilder;
import org.ftt.familytasktracking.enums.IntervalType;

/**
 * Implementation for {@link IntervalType}
 */
public class IntervalTypeSearchQueryParser<U> implements SearchQueryParser<U> {
    @Override
    public BooleanExpression parseSearchQuery(SearchQuery query, PathBuilder<U> path) {
        IntervalType value = (IntervalType) query.value();
        EnumPath<IntervalType> enumPath = path.getEnum(query.key(), IntervalType.class);
        if (query.operation() == '=' || query.operation() == ':') {
            return enumPath.eq(value);
        } else {
            return null;
        }
    }
}
