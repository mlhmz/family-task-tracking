package org.ftt.familytasktracking.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "ftt")
public class ApplicationConfigProperties {
    public static final String SESSION_ID_KEY = "session-id";

    @Getter
    @SuppressWarnings("squid:S1170")
    private final String sessionIdHeaderName = SESSION_ID_KEY;
    @Getter
    @Setter
    private int sessionExpirationInMinutes;
    @Getter
    @Setter
    private int sessionExpirationSchedulingDelayInMinutes;
}
