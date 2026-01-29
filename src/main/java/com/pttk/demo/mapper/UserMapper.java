package com.pttk.demo.mapper;

import com.pttk.demo.dto.request.UserCreationRequest;
import com.pttk.demo.dto.response.UserResponse;
import com.pttk.demo.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userRoles", ignore = true)
    @Mapping(target = "staff", ignore = true)
    @Mapping(target = "customer", ignore = true)
    User toUser(UserCreationRequest request);

    UserResponse toUserResponse(User user);
}
