package org.ftt.familytasktracking.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
public class ApplicationConfigProperties {
    public static final String SESSION_ID_KEY = "session-id";

    private String sessionIdHeaderName = SESSION_ID_KEY;
}
