package com.pttk.demo.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import java.util.List;

@Entity
@Table(name = "tblwarehousestaff")
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WarehouseStaff {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36)
    String id;
    
    @OneToOne
    @JoinColumn(name = "tblStaffId", referencedColumnName = "id")
    Staff staff;
    
    @OneToMany(mappedBy = "warehouseStaff", cascade = CascadeType.ALL)
    List<OnlineBill> onlineBills;
    
    @OneToMany(mappedBy = "warehouseStaff", cascade = CascadeType.ALL)
    List<ImportSlip> importSlips;
    
    public WarehouseStaff(String id, Staff staff) {
        this.id = id;
        this.staff = staff;
    }
}
