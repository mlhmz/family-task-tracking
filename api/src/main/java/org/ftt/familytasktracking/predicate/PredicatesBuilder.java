package org.ftt.familytasktracking.predicate;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import org.ftt.familytasktracking.search.SearchQuery;

import java.util.ArrayList;
import java.util.List;

public class PredicatesBuilder<T> {
    private final List<BooleanExpression> expressions;
    private final Class<T> type;

    public PredicatesBuilder(Class<T> type) {
        this.type = type;
        expressions = new ArrayList<>();
    }

    public PredicatesBuilder<T> with(SearchQuery searchQuery) {
        expressions.add(
                new Predicate<>(type, searchQuery).getPredicate()
        );
        return this;
    }

    public BooleanExpression build() {
        if (expressions.isEmpty()) {
            return null;
        }

        BooleanBuilder reducedExpressions = this.expressions
                .stream()
                .reduce(new BooleanBuilder(), BooleanBuilder::and, BooleanBuilder::and);
        return Expressions.asBoolean(true).isTrue().and(reducedExpressions);
    }
}
