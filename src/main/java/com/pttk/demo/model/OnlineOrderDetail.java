package com.pttk.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "tblonlineorderdetail")
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OnlineOrderDetail {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36)
    String id;
    
    @NotNull
    @Column(name = "quantity")
    Integer quantity;
    
    @Column(name = "salePrice", precision = 10)
    Float salePrice;
    
    @ManyToOne
    @JoinColumn(name = "tblOnlineOrderId", referencedColumnName = "id")
    OnlineOrder onlineOrder;
    
    @ManyToOne
    @JoinColumn(name = "tblProductId", referencedColumnName = "id")
    Product product;
    
    public OnlineOrderDetail(String id, Integer quantity, Float salePrice, 
                             OnlineOrder onlineOrder, Product product) {
        this.id = id;
        this.quantity = quantity;
        this.salePrice = salePrice;
        this.onlineOrder = onlineOrder;
        this.product = product;
    }
}
