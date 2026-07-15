package com.interventionmanager.backend.controller;


import com.interventionmanager.backend.dto.request.LoginRequest;
import com.interventionmanager.backend.dto.response.LoginResponse;
import com.interventionmanager.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
public class AuthController {


    private final AuthService authService;


    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest request
    ) {

        return authService.login(request);

    }
}