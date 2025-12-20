package com.techsolution.ima_backend.services;

import com.techsolution.ima_backend.dtos.request.UserLoginRequest;
import com.techsolution.ima_backend.dtos.request.UserRegisterRequest;
import com.techsolution.ima_backend.dtos.response.AuthResponse;

public interface AuthService {

    AuthResponse login(UserLoginRequest userLoginRequest);
    AuthResponse register(UserRegisterRequest userRegisterRequest);
}
