package com.bookmyshow.Security;

import com.bookmyshow.Config.JwtAuthFilter;
import com.bookmyshow.Config.PasswordConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private PasswordConfig passwordConfig;

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})   // Uses CorsConfig bean
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth

                        // ✅ ALWAYS allow preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ✅ Public APIs
                        .requestMatchers(
                                "/signup/register",
                                "/signup/login",
                                "/forgetpassword/**",
                                "/movies/all",
                                "/movies/id/**",
                                "/movies/search",
                                "/reviews/movie/**"
                        ).permitAll()

                        // ✅ USER + ADMIN
                        .requestMatchers(
                                "/signup/profile",
                                "/theaters/**",
                                "/theater-seats/**",
                                "/shows/**",
                                "/seats/**",
                                "/bookings/**",
                                "/ticket/**",
                                "/reviews/**",
                                "/api/payment/**",
                                "/show-food/show/**"
                        ).hasAnyRole("USER", "ADMIN")

                        // ✅ ADMIN only
                        .requestMatchers(
                                "/movies/add",
                                "/movies/update/**",
                                "/movies/delete/**",
                                "/shows/addShow",
                                "/shows/updateShow/**",
                                "/shows/deleteShow/**",
                                "/theaters/addTheater",
                                "/theaters/updateTheater/**",
                                "/theaters/deleteTheater/**",
                                "/show-food/add",
                                "/show-food/update/**",
                                "/show-food/delete/**"
                        ).hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(passwordConfig.passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
