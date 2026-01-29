package com.pttk.demo.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import java.util.List;

@Entity
@Table(name = "tblcart")
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Cart {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36)
    String id;
    
    @Column(name = "totalPrice", precision = 10)
    Float totalPrice;
    
    @ManyToOne
    @JoinColumn(name = "tblCustomerId", referencedColumnName = "id")
    Customer customer;
    
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL)
    List<CartDetail> cartDetails;
    
    public Cart(String id, Float totalPrice, Customer customer) {
        this.id = id;
        this.totalPrice = totalPrice;
        this.customer = customer;
    }
}
