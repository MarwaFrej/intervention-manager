package com.interventionmanager.backend.service;

import com.interventionmanager.backend.dto.request.LoginRequest;
import com.interventionmanager.backend.dto.response.LoginResponse;
import com.interventionmanager.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.Authentication;


@Service
public class AuthService {


    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;


    public AuthService(
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }


    public LoginResponse login(LoginRequest request) {

			Authentication authentication =
				authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(
						request.email(),
						request.password()
					)
				);


				UserDetails userDetails =
								(UserDetails) authentication.getPrincipal();

        String token = jwtService.generateToken(
                userDetails
        );


        return new LoginResponse(token);
    }
}