package org.ftt.familytasktracking.search;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.BooleanPath;
import com.querydsl.core.types.dsl.PathBuilder;

public class BooleanSearchQueryParser<U> implements SearchQueryParser<U> {
    @Override
    public BooleanExpression parseSearchQuery(SearchQuery query, PathBuilder<U> path) {
        Boolean value = (Boolean) query.value();
        BooleanPath booleanPath = path.getBoolean(query.key());
        return booleanPath.eq(value);
    }
}
