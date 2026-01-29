package com.pttk.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "tblcartdetail")
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartDetail {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36)
    String id;
    
    @NotNull
    @Column(name = "quantity")
    Integer quantity;
    
    @ManyToOne
    @JoinColumn(name = "tblCartId", referencedColumnName = "id")
    Cart cart;
    
    @ManyToOne
    @JoinColumn(name = "tblProductId", referencedColumnName = "id")
    Product product;
    
    public CartDetail(String id, Integer quantity, Cart cart, Product product) {
        this.id = id;
        this.quantity = quantity;
        this.cart = cart;
        this.product = product;
    }
}
