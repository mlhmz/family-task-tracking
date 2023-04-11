package org.ftt.familytasktracking.predicates;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.PathBuilder;
import org.ftt.familytasktracking.search.SearchQuery;
import org.ftt.familytasktracking.search.SearchQueryParser;
import org.ftt.familytasktracking.search.SearchQueryParserFactory;

public class Predicate<T> {
    private final Class<T> type;
    private SearchQuery query;

    public Predicate(Class<T> type) {
        this.type = type;
    }

    public BooleanExpression getPredicate() {
        PathBuilder<T> path = new PathBuilder<>(type, "task");

        SearchQueryParser<T> searchQueryParser = SearchQueryParserFactory.getInstance()
                .getSearchQueryParserByDataType(query);

        return searchQueryParser.parseSearchQuery(query, path);
    }
}
