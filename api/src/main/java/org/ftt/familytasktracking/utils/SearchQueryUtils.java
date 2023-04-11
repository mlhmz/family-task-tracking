package org.ftt.familytasktracking.utils;

import org.apache.commons.lang3.StringUtils;
import org.ftt.familytasktracking.search.SearchQuery;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SearchQueryUtils {
    private static final Pattern UUID_PATTERN =
            Pattern.compile("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");
    public static final Pattern QUERY_PATTERN = Pattern.compile("(\\w+?)(:|<|>|=)(\\w+?),");
    public static final String QUERY_SEPERATOR_CHAR = ",";

    public static List<SearchQuery> parseSearchQueries(String query) {
        Matcher matcher = QUERY_PATTERN.matcher(query + QUERY_SEPERATOR_CHAR);
        List<SearchQuery> searchQueries = new ArrayList<>();
        while (matcher.find()) {
            searchQueries.add(new SearchQuery(matcher.group(1), getFirstCharacter(matcher.group(2)), getType(matcher.group(3))));
        }
        return searchQueries;
    }

    private static Object getType(String value) {
        DateTimeParseResult dateTimeParseResult = getDateTimeParseResult(value);
        if (StringUtils.isNumeric(value)) {
            return Integer.parseInt(value);
        } else if (dateTimeParseResult.success()) {
            return dateTimeParseResult.result();
        } else if (UUID_PATTERN.matcher(value).matches()) {
            return UUID.fromString(value);
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
