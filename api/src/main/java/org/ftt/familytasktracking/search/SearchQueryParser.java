package org.ftt.familytasktracking.search;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.PathBuilder;

/**
 * The SearchQueryParser is a parser that parses a {@link SearchQuery} object to
 * a {@link com.querydsl.core.types.Predicate}
 *
 * @param <U> JPA-Entity
 */
public interface SearchQueryParser<U> {
    BooleanExpression parseSearchQuery(SearchQuery query, PathBuilder<U> path);
}
