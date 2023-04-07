package org.ftt.familytasktracking.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Configuration for Password Encoding
 */
@Configuration
public class PasswordEncoderConfig {
    @Bean
    public PasswordEncoder getDefaultPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
