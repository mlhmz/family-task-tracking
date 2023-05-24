package org.ftt.familytasktracking.search;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.EnumPath;
import com.querydsl.core.types.dsl.PathBuilder;
import org.ftt.familytasktracking.enums.PermissionType;

/**
 * Implementation for {@link PermissionType}
 */
public class PermissionTypeSearchQueryParser<U> implements SearchQueryParser<U> {
    @Override
    public BooleanExpression parseSearchQuery(SearchQuery query, PathBuilder<U> path) {
        PermissionType value = (PermissionType) query.value();
        EnumPath<PermissionType> enumPath = path.getEnum(query.key(), PermissionType.class);
        if (query.operation() == '=' || query.operation() == ':') {
            return enumPath.eq(value);
        } else {
            return null;
        }
    }
}
