package org.ftt.familytasktracking.search;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.UUID;

/**
 * Factory that gets SearchParsers by the Type of the {@link SearchQuery}-Value
 */
public class SearchQueryParserFactory {
    private static SearchQueryParserFactory instance;

    public static SearchQueryParserFactory getInstance() {
        if (instance == null) {
            instance = new SearchQueryParserFactory();
        }
        return instance;
    }

    public <U> SearchQueryParser<U> getSearchQueryParserByDataType(SearchQuery searchQuery) {
        HashMap<Class<?>, SearchQueryParser<U>> parsers = getSearchQueryParserMap();
        SearchQueryParser<U> parser = parsers.get(searchQuery.value().getClass());
        if (parser == null) {
            throw new UnsupportedOperationException();
        }
        return parser;
    }

    private static <U> HashMap<Class<?>, SearchQueryParser<U>> getSearchQueryParserMap() {
        HashMap<Class<?>, SearchQueryParser<U>> parsers = new HashMap<>();
        parsers.put(String.class, new StringSearchQueryParser<>());
        parsers.put(Boolean.class, new BooleanSearchQueryParser<>());
        parsers.put(UUID.class, new UUIDSearchQueryParser<>());
        parsers.put(Integer.class, new IntegerSearchQueryParser<>());
        parsers.put(LocalDateTime.class, new DateTimeSearchQueryParser<>());
        return parsers;
    }
}
