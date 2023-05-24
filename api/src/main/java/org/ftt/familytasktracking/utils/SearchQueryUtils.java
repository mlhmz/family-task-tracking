package org.ftt.familytasktracking.utils;

import org.apache.commons.lang3.StringUtils;
import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.entities.Task;
import org.ftt.familytasktracking.enums.IntervalType;
import org.ftt.familytasktracking.enums.PermissionType;
import org.ftt.familytasktracking.enums.TaskState;
import org.ftt.familytasktracking.search.SearchQuery;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Utils for Search Queries
 */
public class SearchQueryUtils {
    private static final Pattern UUID_PATTERN =
            Pattern.compile("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");
    public static final Pattern QUERY_PATTERN = Pattern.compile("(\\w.+?)([:<>=])([\\s\\S]+?),");
    public static final String QUERY_SEPARATOR_CHAR = ",";

    /**
     * Parses and splits a SearchQuery
     *
     * @param query Query to parse
     * @return {@link List} of {@link SearchQuery}
     */
    public static List<SearchQuery> parseSearchQueries(String query, Class<?> clazz) {
        Matcher matcher = QUERY_PATTERN.matcher(query + QUERY_SEPARATOR_CHAR);
        List<SearchQuery> searchQueries = new ArrayList<>();
        while (matcher.find()) {
            addSearchQueryToList(matcher, searchQueries, clazz);
        }
        return searchQueries;
    }

    /**
     * Adds query to query list with the right type, so we can identify it with the matching query dsl path.
     * <p>
     * Unfortunately, we have to identify every single enum, because query dsl tries to resolve enums as an actual
     * string.
     *
     * @param matcher       Matcher of the {@link #QUERY_PATTERN}
     * @param searchQueries List of the Search Queries
     * @param clazz         Class instance that the potential enum field belongs to
     */
    private static void addSearchQueryToList(Matcher matcher, List<SearchQuery> searchQueries, Class<?> clazz) {
        if (clazz == Profile.class && "permissionType".equals(matcher.group(1))) {
            searchQueries.add(new SearchQuery(matcher.group(1), getFirstCharacter(matcher.group(2)),
                    PermissionType.valueOf(matcher.group(3))));
        } else if (clazz == Task.class && "taskState".equals(matcher.group(1))) {
            searchQueries.add(new SearchQuery(matcher.group(1), getFirstCharacter(matcher.group(2)),
                    TaskState.valueOf(matcher.group(3))));
        } else if (clazz == Task.class && "intervalType".equals(matcher.group(1))) {
            searchQueries.add(new SearchQuery(matcher.group(1), getFirstCharacter(matcher.group(2)),
                    IntervalType.valueOf(matcher.group(3))));
        } else {
            searchQueries.add(new SearchQuery(matcher.group(1), getFirstCharacter(matcher.group(2)),
                    parseValueAndGetType(matcher.group(3))));
        }
    }

    /**
     * Parses the value and returns the actual typed object
     *
     * @param value Value that is being parsed
     * @return untyped Object that is being returned
     */
    private static Object parseValueAndGetType(String value) {
        DateTimeParseResult dateTimeParseResult = getDateTimeParseResult(value);
        if (StringUtils.isNumeric(value)) {
            return Integer.parseInt(value);
        } else if (dateTimeParseResult.success()) {
            return dateTimeParseResult.result();
        } else if (UUID_PATTERN.matcher(value).matches()) {
            return UUID.fromString(value);
        } else if (value.equals("true") || value.equals("false")) {
            return Boolean.parseBoolean(value);
        } else {
            return value;
        }
    }

    private static char getFirstCharacter(String value) {
        return value.charAt(0);
    }

    private static DateTimeParseResult getDateTimeParseResult(String value) {
        try {
            return new DateTimeParseResult(LocalDateTime.parse(value), true);
        } catch (DateTimeParseException exception) {
            return new DateTimeParseResult(null, false);
        }
    }

    private record DateTimeParseResult(LocalDateTime result, boolean success) {
    }
}
