package com.interventionmanager.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.util.Date;
import javax.crypto.SecretKey;


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
}