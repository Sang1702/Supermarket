package com.pttk.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "tblimportslipdetail")
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImportSlipDetail {
    
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
    @JoinColumn(name = "tblImportSlipId", referencedColumnName = "id")
    ImportSlip importSlip;
    
    @ManyToOne
    @JoinColumn(name = "tblProductId", referencedColumnName = "id")
    Product product;
    
    public ImportSlipDetail(String id, Integer quantity, Float price, 
                            ImportSlip importSlip, Product product) {
        this.id = id;
        this.quantity = quantity;
        this.price = price;
        this.importSlip = importSlip;
        this.product = product;
    }
}
