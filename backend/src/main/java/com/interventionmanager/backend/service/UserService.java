package com.interventionmanager.backend.service;

import com.interventionmanager.backend.dto.response.UserResponse;
import com.interventionmanager.backend.entity.User;
import com.interventionmanager.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.interventionmanager.backend.dto.request.CreateUserRequest;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private UserResponse toResponse(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public UserResponse createUser(CreateUserRequest request) {
        User user = new User();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already exists");
        }
        user.setEmail(request.email());
        user.setPassword(request.password());
        user.setRole(request.role());

        User savedUser = userRepository.save(user);

        return toResponse(savedUser);
    }
}