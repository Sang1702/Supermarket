package com.pttk.demo.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import java.util.List;

@Entity
@Table(name = "tblsalestaff")
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SaleStaff {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36)
    String id;
    
    @OneToOne
    @JoinColumn(name = "tblStaffId", referencedColumnName = "id")
    Staff staff;
    
    @OneToMany(mappedBy = "saleStaff", cascade = CascadeType.ALL)
    List<Bill> bills;
    
    public SaleStaff(String id, Staff staff) {
        this.id = id;
        this.staff = staff;
    }
}
