package com.techsolution.ima_backend.controller;

import com.techsolution.ima_backend.dtos.request.UserRegisterRequest;
import com.techsolution.ima_backend.dtos.response.UserResponse;
import com.techsolution.ima_backend.services.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users", description = "Api de gestion des utilisateurs")
public class UserController {

    private final UserService userService;

    //Build add User REST API
    @PostMapping
    public ResponseEntity<UserResponse>  createUser(@RequestBody UserRegisterRequest userRegisterRequest) {
        UserResponse savedUser = userService.createUser(userRegisterRequest);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    //Build get User REST API
    @GetMapping("{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable("id") Long userId) {
        UserResponse userResponse = userService.getUserById(userId);
        return ResponseEntity.ok(userResponse);
    }

    //Build get all User REST API
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    //Build update User REST API
    @PutMapping("{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable("id") Long userId,
                                                   @RequestBody UserRegisterRequest userRegisterRequest) {
        UserResponse updatedUser = userService.updateUser(userId, userRegisterRequest);
        return ResponseEntity.ok(updatedUser);
    }

    //Build delete User REST API
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    //Build search User REST API
    @GetMapping("/search")
    public ResponseEntity<UserResponse> searchUser(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "name", required = false) String name
    ) {
        // It's often helpful to log the incoming request for debugging
        log.info("Searching for users with keyword: {}, email: {}, name: {}", keyword, email, name);

        UserResponse user = userService.searchUser(keyword, email, name);
        return ResponseEntity.ok(user);
    }
}
