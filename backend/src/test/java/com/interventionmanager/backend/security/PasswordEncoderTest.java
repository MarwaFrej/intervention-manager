package com.interventionmanager.backend.security;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertTrue;

class PasswordEncoderTest {

    private final PasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();
@Test
void generatePasswordHash() {
    PasswordEncoder encoder = new BCryptPasswordEncoder();

    String hash = encoder.encode("password1234");

    System.out.println("HASH = " + hash);
}
}