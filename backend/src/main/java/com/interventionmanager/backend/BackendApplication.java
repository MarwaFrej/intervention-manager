package com.interventionmanager.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;


@SpringBootApplication
@EnableMethodSecurity
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping
	public UserResponse createUser(
			@Valid @RequestBody CreateUserRequest request
	) {
		return userService.createUser(request);
	}
}
