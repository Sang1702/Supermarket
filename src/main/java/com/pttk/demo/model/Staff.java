package com.pttk.demo.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "tblstaff")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Staff {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36)
    String id;
    
    @Column(name = "position", length = 255)
    String position;
    
    @OneToOne
    @JoinColumn(name = "tblUserId", referencedColumnName = "id")
    User user;
    
    @OneToOne(mappedBy = "staff", cascade = CascadeType.ALL)
    ManagementStaff managementStaff;
    
    @OneToOne(mappedBy = "staff", cascade = CascadeType.ALL)
    DeliveryStaff deliveryStaff;
    
    @OneToOne(mappedBy = "staff", cascade = CascadeType.ALL)
    WarehouseStaff warehouseStaff;
    
    @OneToOne(mappedBy = "staff", cascade = CascadeType.ALL)
    SaleStaff saleStaff;
    
    public Staff(String id, String position, User user) {
        this.id = id;
        this.position = position;
        this.user = user;
    }
}
