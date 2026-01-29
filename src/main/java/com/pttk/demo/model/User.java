package com.pttk.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "tbluser")
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36)
    String id;

    @Column(name = "fullName", length = 255)
    String fullName;

    @NotBlank
    @Column(name = "userName", length = 255, unique = true)
    String userName;

    @NotBlank
    @Column(name = "password", length = 255)
    String password;

    @Column(name = "birthDay")
    LocalDate birthDay;

    @Column(name = "address", length = 255)
    String address;

    @Email
    @Column(name = "email", length = 255, unique = true)
    String email;

    @Size(max = 15)
    @Column(name = "phone", length = 15, unique = true)
    String phone;

    @Column(name = "note", length = 255, nullable = true)
    String note;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<UserRole> userRoles;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    Staff staff;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    Customer customer;

    public User(String id, String fullName, String userName, String password,
                LocalDate birthDay, String address, String email, String phone,
                String note) {
        this.id = id;
        this.fullName = fullName;
        this.userName = userName;
        this.password = password;
        this.birthDay = birthDay;
        this.address = address;
        this.email = email;
        this.phone = phone;
        this.note = note;
    }
}
