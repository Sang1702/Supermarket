package com.pttk.demo.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "tblmanagementstaff")
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ManagementStaff {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36)
    String id;
    
    @OneToOne
    @JoinColumn(name = "tblStaffId", referencedColumnName = "id")
    Staff staff;
    
    public ManagementStaff(String id, Staff staff) {
        this.id = id;
        this.staff = staff;
    }
}
