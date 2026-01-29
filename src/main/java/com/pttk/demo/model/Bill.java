package com.pttk.demo.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "tblbill")
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Bill {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36)
    String id;
    
    @Column(name = "date")
    LocalDate date;
    
    @Column(name = "totalPrice", precision = 10)
    Float totalPrice;
    
    @Column(name = "paymentMethod", length = 255)
    String paymentMethod;
    
    @ManyToOne
    @JoinColumn(name = "tblSaleStaffId", referencedColumnName = "id")
    SaleStaff saleStaff;
    
    @ManyToOne
    @JoinColumn(name = "tblCustomerId", referencedColumnName = "id", nullable = true)
    Customer customer;
    
    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL)
    List<BillDetail> billDetails;

    public Bill(String id, LocalDate date, Float totalPrice, String paymentMethod,
                SaleStaff saleStaff, Customer customer) {
        this.id = id;
        this.date = date;
        this.totalPrice = totalPrice;
        this.paymentMethod = paymentMethod;
        this.saleStaff = saleStaff;
        this.customer = customer;
    }
}
