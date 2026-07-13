package com.interventionmanager.backend.service;

import com.interventionmanager.backend.dto.request.CreateUserRequest;
import com.interventionmanager.backend.dto.response.UserResponse;
import com.interventionmanager.backend.entity.User;
import com.interventionmanager.backend.mapper.UserMapper;
import com.interventionmanager.backend.repository.UserRepository;
import com.interventionmanager.backend.exception.UserAlreadyExistsException;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }

    public UserResponse createUser(CreateUserRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new UserAlreadyExistsException(request.email());
        }

        User user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(request.password())
                .role(request.role())
                .build();

        User savedUser = userRepository.save(user);

        return userMapper.toResponse(savedUser);
    }
}