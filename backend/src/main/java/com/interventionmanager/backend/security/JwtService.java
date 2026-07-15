package com.interventionmanager.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;


@Service
public class JwtService {

    private final SecretKey secretKey;


    public JwtService() {
        this.secretKey = Keys.hmacShaKeyFor(
                "my-super-secret-key-that-is-long-enough-for-hs256"
                        .getBytes()
        );
    }


    public String generateToken(String email) {

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis() + 86400000)
                )
                .signWith(secretKey)
                .compact();
    }


    public String extractEmail(String token) {

        return extractClaims(token)
                .getSubject();
    }


    public boolean isTokenValid(String token) {

        try {

            extractClaims(token);

            return true;

        } catch (Exception e) {

            return false;
        }
    }


    private Claims extractClaims(String token) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}