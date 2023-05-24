package org.ftt.familytasktracking.search;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.EnumPath;
import com.querydsl.core.types.dsl.PathBuilder;
import org.ftt.familytasktracking.enums.TaskState;

/**
 * Implementation for {@link TaskState}
 */
public class TaskStateSearchQueryParser<U> implements SearchQueryParser<U> {
    @Override
    public BooleanExpression parseSearchQuery(SearchQuery query, PathBuilder<U> path) {
        TaskState value = (TaskState) query.value();
        EnumPath<TaskState> enumPath = path.getEnum(query.key(), TaskState.class);
        if (query.operation() == '=' || query.operation() == ':') {
            return enumPath.eq(value);
        } else {
            return null;
        }
    }
}
