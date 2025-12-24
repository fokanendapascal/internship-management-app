package com.techsolution.ima_backend.config;

import com.techsolution.ima_backend.security.JwtAuthFilter;
import com.techsolution.ima_backend.services.impl.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                        // 🔹 1. Routes publiques
                        .requestMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-resources/**",
                                "/webjars/**",
                                "/api/v1/auth/login",
                                "/api/v1/auth/register"
                        ).permitAll()

                        // 🔹 2. Agreements (Conventions)
                        .requestMatchers(HttpMethod.GET, "/api/v1/agreements/**")
                        .hasAnyAuthority("ROLE_STUDENT", "ROLE_TEACHER", "ROLE_COMPANY", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/agreements/**")
                        .hasAnyAuthority("ROLE_STUDENT", "ROLE_COMPANY")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/agreements/*/validate")
                        .hasAuthority("ROLE_TEACHER")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/agreements/**")
                        .hasAnyAuthority("ROLE_TEACHER", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/agreements/**")
                        .hasAuthority("ROLE_ADMIN")

                        // 🔹 3. Applications
                        .requestMatchers(HttpMethod.GET, "/api/v1/applications/**")
                        .hasAnyAuthority("ROLE_STUDENT", "ROLE_TEACHER", "ROLE_COMPANY", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/applications")
                        .hasAuthority("ROLE_STUDENT")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/applications/**")
                        .hasAnyAuthority("ROLE_STUDENT", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/applications/**")
                        .hasAuthority("ROLE_ADMIN")

                        // 🔹 4. Internships
                        .requestMatchers(HttpMethod.GET, "/api/v1/internships/**")
                        .hasAnyAuthority("ROLE_STUDENT", "ROLE_TEACHER", "ROLE_COMPANY", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/internships/**")
                        .hasAnyAuthority("ROLE_COMPANY", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/internships/**")
                        .hasAnyAuthority("ROLE_COMPANY", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/internships/**")
                        .hasAnyAuthority("ROLE_COMPANY", "ROLE_ADMIN")

                        // 🔹 5. Files (upload/download)
                        .requestMatchers("/api/v1/files/**")
                        .authenticated()

                        // 🔹 6. Messages & Notifications
                        .requestMatchers("/api/v1/messages/**", "/api/v1/notifications/**")
                        .hasAnyAuthority("ROLE_STUDENT", "ROLE_TEACHER", "ROLE_COMPANY", "ROLE_ADMIN")

                        // 🔹 7. Users, Companies, Students, Teachers
                        .requestMatchers(HttpMethod.GET, "/api/v1/students/**", "/api/v1/teachers/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_TEACHER", "ROLE_STUDENT") // Permettre la lecture

                        .requestMatchers("/api/v1/users/**", "/api/v1/companies/**")
                        .hasAuthority("ROLE_ADMIN") // Garder la modification/suppression pour l'admin

                        .requestMatchers("/api/v1/users/**").authenticated()
                        // 🔹 8. Toute autre requête doit être authentifiée
                        .anyRequest().authenticated()
                )

                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(
                                (req, res, exAuth) -> res.sendError(401, "Non autorisé")
                        )
                )

                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .userDetailsService(userDetailsService);

        return http.build();
    }

    // 🔹 CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "http://localhost:4200"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // 🔹 Password Encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 🔹 Authentication Manager
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}
