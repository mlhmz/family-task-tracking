package org.ftt.familytasktracking.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.ftt.familytasktracking.config.ApplicationConfigProperties;
import org.ftt.familytasktracking.exceptions.ErrorDetails;
import org.ftt.familytasktracking.exceptions.WebRtException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.regex.Pattern;

@Component
@Slf4j
public abstract class AuthorizedFilter implements Filter {
    protected static final Pattern UUID_REGEX =
            Pattern.compile("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");
    protected HttpServletRequest request;
    protected HttpServletResponse response;
    protected JwtDecoder jwtDecoder;
    protected ApplicationConfigProperties appProps;

    protected AuthorizedFilter(JwtDecoder jwtDecoder, ApplicationConfigProperties appProps) {
        this.jwtDecoder = jwtDecoder;
        this.appProps = appProps;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        this.request = (HttpServletRequest) request;
        this.response = (HttpServletResponse) response;

        String jwtKey = getHeader("Authorization").split(" ")[1];
        Jwt jwt = jwtDecoder.decode(jwtKey);

        try {
            doAuthFilter(jwt);
            chain.doFilter(request, response);
        } catch (WebRtException exception) {
            convertWebRtExceptionToServletError(exception);
        }
    }

    protected String getHeader(String headerName) {
        return this.request.getHeader(headerName);
    }

    protected void convertWebRtExceptionToServletError(WebRtException exception) throws IOException {
        ErrorDetails errorDetails = exception.getErrorDetails();
        this.response.sendError(errorDetails.httpStatus(), errorDetails.message());
    }

    protected abstract void doAuthFilter(Jwt jwt);
}
