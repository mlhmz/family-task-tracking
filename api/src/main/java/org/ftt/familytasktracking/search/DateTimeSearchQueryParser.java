package org.ftt.familytasktracking.search;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.DateTimePath;
import com.querydsl.core.types.dsl.PathBuilder;

import java.time.LocalDateTime;

public class DateTimeSearchQueryParser<U> implements SearchQueryParser<U> {
    @Override
    public BooleanExpression parseSearchQuery(SearchQuery query, PathBuilder<U> path) {
        LocalDateTime dateTime = (LocalDateTime) query.value();
        DateTimePath<LocalDateTime> dateTimePath = path.getDateTime(query.key(), LocalDateTime.class);
        return switch (query.operation()) {
            case '>' -> dateTimePath.loe(dateTime);
            case '<' -> dateTimePath.goe(dateTime);
            case ':' -> dateTimePath.eq(dateTime);
            default -> null;
        };
    }
}
