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
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

        httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // 🔹 Routes publiques
                        .requestMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/v3/api-docs",
                                "/swagger-resources/**",
                                "/webjars/**",
                                "/api/v1/auth/login",
                                "/api/v1/auth/register"
                                ).permitAll()

                        // 🔹 2. Exigences spécifiques (RÔLES AJOUTÉS)

                        // Seules les entreprises (COMPANY) et les administrateurs peuvent créer/modifier des stages
                        .requestMatchers(HttpMethod.POST, "/api/v1/internships").hasAnyAuthority("ROLE_COMPANY", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/internships/**").hasAnyAuthority("ROLE_COMPANY", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/internships/**").hasAnyAuthority("ROLE_COMPANY", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/v1/internships/**").permitAll()

                        // Seuls les étudiants (STUDENT) et les admins peuvent créer/modidier les candidatures
                        .requestMatchers(HttpMethod.POST, "/api/v1/applications").hasAnyAuthority("ROLE_STUDENT")
                        .requestMatchers(HttpMethod.POST, "/api/v1/applications/for-student/**").hasAnyAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/applications/**").hasAnyAuthority("ROLE_STUDENT", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/applications/**").hasAnyAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/v1/applications/**").permitAll()

                        //Seuls les enseignants (TEACHER) et les admins peuvent créer/modifier les conventions
                        .requestMatchers(HttpMethod.POST, "/api/v1/agreements").hasAnyAuthority("ROLE_TEACHER")
                        .requestMatchers(HttpMethod.POST, "/api/v1/agreements/admin-create").hasAnyAuthority( "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/agreements/*/validate").hasAuthority("ROLE_TEACHER")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/agreements/**").hasAnyAuthority("ROLE_TEACHER", "ROLE_ADMIN", "ROLE_STUDENT", "ROLE_COMPANY")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/agreements/**").hasAnyAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/v1/agreements/**").permitAll()

                        // Seuls les ADMIN peuvent gérer les utilisateurs
                        .requestMatchers("/api/v1/users/**").hasAuthority("ROLE_ADMIN")

                        // Les autres routes nécessitent juste l'authentification
                        .requestMatchers(
                                "/api/v1/companies/**",
                                "/api/v1/teachers/**",
                                "/api/v1/students/**",
                                "/api/v1/messages/**",
                                "/api/v1/notifications/**"
                        ).authenticated()

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .userDetailsService(userDetailsService);

        return httpSecurity.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:3000",   // React
                "http://localhost:4200"    // Angular (si besoin)
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
