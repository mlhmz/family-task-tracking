package org.ftt.familytasktracking.security;

import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.oidc.StandardClaimNames;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {

    public static final String KC_ROLES_KEY = "roles";
    public static final String KC_REALM_ACCESS_KEY = "realm_access";
    public static final String KC_RESOURCE_ACCESS_KEY = "resource_access";
    public static final String KC_SPRING_ADDONS_CONFIDENTIAL_KEY = "spring-addons-confidential";
    public static final String KC_SPRING_ADDONS_PUBLIC = "spring-addons-public";

    public interface Jwt2AuthoritiesConverter extends Converter<Jwt, Collection<? extends GrantedAuthority>> {
    }

    @Bean
    @SuppressWarnings("unchecked")
    public Jwt2AuthoritiesConverter authoritiesConverter() {
        return jwt -> {
            final Map<String, Object> realmAccess =
                    (Map<String, Object>) jwt.getClaims().getOrDefault(KC_REALM_ACCESS_KEY, Map.of());
            final Collection<String> realmRoles =
                    (Collection<String>) realmAccess.getOrDefault(KC_ROLES_KEY, List.of());

            final Map<String, Object> resourceAccess =
                    (Map<String, Object>) jwt.getClaims().getOrDefault(KC_RESOURCE_ACCESS_KEY, Map.of());

            final Map<String, Object> confidentialClientAccess =
                    (Map<String, Object>) resourceAccess.getOrDefault(KC_SPRING_ADDONS_CONFIDENTIAL_KEY, Map.of());
            final Collection<String> confidentialClientRoles =
                    (Collection<String>) confidentialClientAccess.getOrDefault(KC_ROLES_KEY, List.of());
            final Map<String, Object> publicClientAccess =
                    (Map<String, Object>) resourceAccess.getOrDefault(KC_SPRING_ADDONS_PUBLIC, Map.of());
            final Collection<String> publicClientRoles =
                    (Collection<String>) publicClientAccess.getOrDefault(KC_ROLES_KEY, List.of());

            return Stream.concat(
                    realmRoles.stream(),
                    Stream.concat(confidentialClientRoles.stream(), publicClientRoles.stream())
                    )
                    .map(SimpleGrantedAuthority::new).toList();
        };
    }

    public interface Jwt2AuthenticationConverter extends Converter<Jwt, JwtAuthenticationToken> {
    }

    @Bean
    public Jwt2AuthenticationConverter authenticationConverter(Jwt2AuthoritiesConverter authoritiesConverter) {
        return jwt -> new JwtAuthenticationToken(jwt, authoritiesConverter.convert(jwt),
                jwt.getClaimAsString(StandardClaimNames.PREFERRED_USERNAME));
    }

    @Order
    @Bean
    public SecurityFilterChain apiFilterChain(
            HttpSecurity http,
            ServerProperties serverProperties,
            Converter<Jwt, ? extends AbstractAuthenticationToken> authenticationConverter
    ) throws Exception {

        http.oauth2ResourceServer().jwt().jwtAuthenticationConverter(authenticationConverter);

        http.anonymous();

        http.cors().configurationSource(corsConfigurationSource());

        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).disable();
        http.csrf().disable();

        http.exceptionHandling().authenticationEntryPoint((request, response, authException) -> {
            response.addHeader(HttpHeaders.WWW_AUTHENTICATE, "Basic realm=\"Restricted Content\"");
            response.sendError(HttpStatus.UNAUTHORIZED.value(), HttpStatus.UNAUTHORIZED.getReasonPhrase());
        });

        if (serverProperties.getSsl() != null && serverProperties.getSsl().isEnabled()) {
            http.requiresChannel().anyRequest().requiresSecure();
        }

        http.authorizeHttpRequests()
                .requestMatchers("/actuator/health", "/swagger/**", "/swagger-ui/**", "/v3/api-docs/**")
                .permitAll()
                .anyRequest().authenticated();

        return http.build();
    }

    private CorsConfigurationSource corsConfigurationSource() {
        final var configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(List.of("*"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("*"));

        final var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
