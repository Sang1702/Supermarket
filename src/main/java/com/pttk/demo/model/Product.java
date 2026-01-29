package com.pttk.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import java.util.List;

@Entity
@Table(name = "tblproduct")
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36)
    String id;
    
    @NotBlank
    @Column(name = "code", length = 255, unique = true)
    String code;
    
    @Column(name = "description", length = 255, nullable = true)
    String description;
    
    @NotBlank
    @Column(name = "name", length = 255)
    String name;
    
    @Column(name = "unit", length = 255)
    String unit;
    
    @NotNull
    @Column(name = "importPrice", precision = 10)
    Float importPrice;
    
    @NotNull
    @Column(name = "salePrice", precision = 10)
    Float salePrice;
    
    @NotNull
    @Column(name = "quantity")
    Integer quantity;
    
    @Column(name = "category", length = 255)
    String category;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    List<CartDetail> cartDetails;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    List<OnlineOrderDetail> onlineOrderDetails;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    List<BillDetail> billDetails;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    List<ImportSlipDetail> importSlipDetails;
    
    public Product(String id, String code, String description, String name, 
                   String unit, Float importPrice, Float salePrice, 
                   Integer quantity, String category) {
        this.id = id;
        this.code = code;
        this.description = description;
        this.name = name;
        this.unit = unit;
        this.importPrice = importPrice;
        this.salePrice = salePrice;
        this.quantity = quantity;
        this.category = category;
    }
}
