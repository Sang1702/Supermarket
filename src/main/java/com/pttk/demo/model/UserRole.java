package com.pttk.demo.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;

@Entity
@Table(name = "tbluserrole", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "roleId"}))
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRole {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36)
    String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", referencedColumnName = "id", nullable = false)
    User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roleId", referencedColumnName = "id", nullable = false)
    Role role;
    
    @Column(name = "assignedAt")
    LocalDateTime assignedAt;
    
    @Column(name = "isActive")
    Boolean isActive;
    
    public UserRole() {
        this.assignedAt = LocalDateTime.now();
        this.isActive = true;
    }
    
    public UserRole(String id, User user, Role role) {
        this.id = id;
        this.user = user;
        this.role = role;
        this.assignedAt = LocalDateTime.now();
        this.isActive = true;
    }
}
