package com.pttk.demo.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;

@Entity
@Table(name = "tblrolepermission",
       uniqueConstraints = @UniqueConstraint(columnNames = {"roleId", "permissionId"}))
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RolePermission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36)
    String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roleId", referencedColumnName = "id", nullable = false)
    Role role;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "permissionId", referencedColumnName = "id", nullable = false)
    Permission permission;
    
    @Column(name = "assignedAt")
    LocalDateTime assignedAt;
    
    @Column(name = "isActive")
    Boolean isActive;
    
    public RolePermission() {
        this.assignedAt = LocalDateTime.now();
        this.isActive = true;
    }
    
    public RolePermission(String id, Role role, Permission permission) {
        this.id = id;
        this.role = role;
        this.permission = permission;
        this.assignedAt = LocalDateTime.now();
        this.isActive = true;
    }
}
