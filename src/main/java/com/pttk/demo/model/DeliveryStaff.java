package com.pttk.demo.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import java.util.List;

@Entity
@Table(name = "tbldeliverystaff")
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DeliveryStaff {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36)
    String id;
    
    @OneToOne
    @JoinColumn(name = "tblStaffId", referencedColumnName = "id")
    Staff staff;
    
    @OneToMany(mappedBy = "deliveryStaff", cascade = CascadeType.ALL)
    List<OnlineBill> onlineBills;
    
    public DeliveryStaff(String id, Staff staff) {
        this.id = id;
        this.staff = staff;
    }
}
