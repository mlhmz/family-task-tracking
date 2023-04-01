package org.ftt.familytasktracking.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "ftt")
public class ApplicationConfigProperties {
    private String sessionIdHeaderName;
}
