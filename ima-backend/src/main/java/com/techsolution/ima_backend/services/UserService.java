package com.techsolution.ima_backend.services;

import com.techsolution.ima_backend.dtos.request.UserRegisterRequest;
import com.techsolution.ima_backend.dtos.response.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse createUser(UserRegisterRequest userRegisterRequest);
    UserResponse getUserById(Long userId);
    List<UserResponse> getAllUsers();
    UserResponse updateUser(Long userId, UserRegisterRequest userRegisterRequest);
    void deleteUser(Long userId);

    // 🔍 Search
    UserResponse searchUser(String keyword, String email, String name);
}
