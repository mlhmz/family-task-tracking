package org.ftt.familytasktracking.predicate;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.PathBuilder;
import org.ftt.familytasktracking.search.SearchQuery;
import org.ftt.familytasktracking.search.SearchQueryParser;
import org.ftt.familytasktracking.search.SearchQueryParserFactory;

/**
 * Generic Predicate that Triggers {@link SearchQueryParser} to get a {@link Boolean}
 *
 * @param <T> JPA-Entity
 */
public class Predicate<T> {
    private final Class<T> type;
    private final SearchQuery query;

    public Predicate(Class<T> type, SearchQuery query) {
        this.type = type;
        this.query = query;
    }

    /**
     * Gets a predicate for a SearchQuery
     *
     * @return Functional {@link BooleanExpression}
     */
    public BooleanExpression getPredicate() {
        PathBuilder<T> path = new PathBuilder<>(type, type.getSimpleName().toLowerCase());

        SearchQueryParser<T> searchQueryParser = SearchQueryParserFactory.getInstance()
                .getSearchQueryParserByDataType(query);

        return searchQueryParser.parseSearchQuery(query, path);
    }
}
