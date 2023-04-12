package org.ftt.familytasktracking.search;

import java.time.LocalDateTime;
import java.util.UUID;

public class SearchQueryParserFactory {
    private static SearchQueryParserFactory instance;

    public static SearchQueryParserFactory getInstance() {
        if (instance == null) {
            instance = new SearchQueryParserFactory();
        }
        return instance;
    }

    public <U> SearchQueryParser<U> getSearchQueryParserByDataType(SearchQuery searchQuery) {
        if (searchQuery.value().getClass().equals(String.class)) {
            return new StringSearchQueryParser<>();
        } else if (searchQuery.value().getClass().equals(Boolean.class)) {
            return new BooleanSearchQueryParser<>();
        } else if (searchQuery.value().getClass().equals(UUID.class)) {
            return new UUIDSearchQueryParser<>();
        } else if (searchQuery.value().getClass().equals(Integer.class)) {
            return new IntegerSearchQueryParser<>();
        } else if (searchQuery.value().getClass().equals(LocalDateTime.class)) {
            return new DateTimeSearchQueryParser<>();
        } else {
            throw new UnsupportedOperationException();
        }
    }
}
