package com.pttk.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "tblbilldetail")
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillDetail {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36)
    String id;
    
    @NotNull
    @Column(name = "quantity")
    Integer quantity;
    
    @Column(name = "price", precision = 10)
    Float price;
    
    @ManyToOne
    @JoinColumn(name = "tblBillId", referencedColumnName = "id")
    Bill bill;
    
    @ManyToOne
    @JoinColumn(name = "tblProductId", referencedColumnName = "id")
    Product product;
    
    public BillDetail(String id, Integer quantity, Float price, Bill bill, Product product) {
        this.id = id;
        this.quantity = quantity;
        this.price = price;
        this.bill = bill;
        this.product = product;
    }
}
