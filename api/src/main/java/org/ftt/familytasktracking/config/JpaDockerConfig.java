package org.ftt.familytasktracking.config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

@Profile(value = {"docker"})
@Configuration
public class JpaDockerConfig {
    @Bean
    @Primary
    public DataSource getDataSource() {
        return DataSourceBuilder.create()
                .driverClassName("org.postgresql.Driver")
                .url(getDataSourceUrl())
                .username(System.getenv("DB_USERNAME"))
                .password(System.getenv("DB_PASSWORD"))
                .build();
    }

    private String getDataSourceUrl() {
        return "jdbc:postgresql://" + System.getenv("DB_HOST") + "/" +
                System.getenv("DB_NAME");
    }
}
