package com.pttk.demo.dto.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest
{
    String fullName;
    String password;
    LocalDate birthDay;
    String address;
    String email;
    String phone;
    String note;
}
