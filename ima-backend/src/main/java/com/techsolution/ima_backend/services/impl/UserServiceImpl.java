package com.techsolution.ima_backend.services.impl;

import com.techsolution.ima_backend.dtos.request.UserRegisterRequest;
import com.techsolution.ima_backend.dtos.response.UserResponse;
import com.techsolution.ima_backend.entities.User;
import com.techsolution.ima_backend.entities.UserRole;
import com.techsolution.ima_backend.exceptions.ResourceNotFoundException;
import com.techsolution.ima_backend.mappers.UserMapper;
import com.techsolution.ima_backend.repository.UserRepository;
import com.techsolution.ima_backend.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponse createUser(UserRegisterRequest userRegisterRequest) {
        User user = UserMapper.toEntity(userRegisterRequest);
        user.setPassword(passwordEncoder.encode(userRegisterRequest.getPassword()));
        User savedUser = userRepository.save(user);
        return UserMapper.toResponseDto(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(()->
                new ResourceNotFoundException("User is not exists with given id" + userId)
        );
        return UserMapper.toResponseDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(UserMapper::toResponseDto)
                    .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long userId, UserRegisterRequest userRegisterRequest) {

        // 1. Récupérer l'utilisateur (OK)
        User user = userRepository.findById(userId).orElseThrow(()->
                new ResourceNotFoundException("User is not exists with given id" + userId)
        );

        // 2. Mise à jour des champs non sensibles (OK)
        user.setFirstName(userRegisterRequest.getFirstName());
        user.setLastName(userRegisterRequest.getLastName());
        user.setEmail(userRegisterRequest.getEmail());
        user.setTelephone(userRegisterRequest.getTelephone());

        if (userRegisterRequest.getPassword() != null && !userRegisterRequest.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userRegisterRequest.getPassword()));
        }

        // 4. Gestion de la mise à jour des rôles (CORRECTION CRITIQUE DE L'IMMUTABILITÉ)
        // ATTENTION : Cette logique suppose que seul un ADMIN peut appeler cette méthode pour changer les rôles.
        if (userRegisterRequest.getRoles() != null && !userRegisterRequest.getRoles().isEmpty()) {
            List<UserRole> updatedRoles = userRegisterRequest.getRoles().stream()
                    .map(UserRole::valueOf)
                    .collect(Collectors.toList());
            user.setRoles(updatedRoles);

        } else {
            user.setRoles(new ArrayList<>());
        }

        User updatedUser = userRepository.save(user);
        return UserMapper.toResponseDto(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {

        User user = userRepository.findById(userId).orElseThrow(()->
                new ResourceNotFoundException("User is not exists with given id" + userId)
        );
        userRepository.deleteById(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse searchUser(String keyword, String email, String name) {
        return findUser(keyword, email, name)
                .map(UserMapper::toResponseDto)
                .orElseThrow(() -> new EntityNotFoundException("Aucun utilisateur trouvé avec les critères fournis."));
    }

    private Optional<User> findUser(String keyword, String email, String name) {
        if (StringUtils.hasText(email)) return userRepository.findByEmailIgnoreCase(email);
        if (StringUtils.hasText(name)) return userRepository.findFirstByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name);
        if (StringUtils.hasText(keyword)) return userRepository.searchFirstByKeyword(keyword);

        throw new IllegalArgumentException("Au moins un critère de recherche est requis");
    }


}
