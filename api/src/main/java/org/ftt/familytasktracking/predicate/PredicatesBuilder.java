package org.ftt.familytasktracking.predicate;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import org.ftt.familytasktracking.search.SearchQuery;

import java.util.List;
import java.util.Objects;

public class PredicatesBuilder<T> {
    private List<SearchQuery> queries;
    private final Class<T> type;

    public PredicatesBuilder(Class<T> type) {
        this.type = type;
    }

    public PredicatesBuilder<T> with(SearchQuery searchQuery) {
        queries.add(searchQuery);
        return this;
    }

    public BooleanExpression build() {
        if (queries.isEmpty()) {
            return null;
        }

        List<BooleanExpression> expressions = queries.stream()
                .map(query -> new Predicate<>(type, query))
                .map(Predicate::getPredicate)
                .filter(Objects::nonNull)
                .toList();

        BooleanExpression result = Expressions.asBoolean(true).isTrue();
        for (BooleanExpression expression : expressions) {
            result = result.and(expression);
        }
        return result;
    }
}
