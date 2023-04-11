package org.ftt.familytasktracking.search;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.PathBuilder;

public interface SearchQueryParser<U> {
    BooleanExpression parseSearchQuery(SearchQuery query, PathBuilder<U> path);
}
