package com.pttk.demo.controller;

import com.pttk.demo.dto.request.UserCreationRequest;
import com.pttk.demo.dto.request.UserUpdateRequest;
import com.pttk.demo.dto.response.UserResponse;
import com.pttk.demo.model.User;
import com.pttk.demo.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/users")
public class UserController
{
    UserService userService;

    @PostMapping
    UserResponse createUser(@RequestBody UserCreationRequest request)
    {
        return userService.createUser(request);
    }

    @GetMapping
    List<User> getUsers()
    {
        return userService.getUsers();
    }

    @GetMapping("/{userId}")
    User getUser(@PathVariable("userId") String userId){
        return userService.getUser(userId);
    }
    
    @GetMapping("/search")
    List<User> searchUsersByName(@RequestParam("name") String name)
    {
        return userService.searchUsersByName(name);
    }

    @PutMapping("/{userId}")
    User updateUser(@PathVariable("userId") String userId, UserUpdateRequest request)
    {
        return userService.updateUser(userId, request);
    }

    @DeleteMapping("/{userId}")
    String deleteUser(@PathVariable("userId") String userId)
    {
        userService.deleteUser(userId);
        return "user has been deleted";
    }

}
