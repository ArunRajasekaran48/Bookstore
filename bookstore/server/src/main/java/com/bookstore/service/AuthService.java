package com.bookstore.service;

import com.bookstore.dto.AuthDTOs.*;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
