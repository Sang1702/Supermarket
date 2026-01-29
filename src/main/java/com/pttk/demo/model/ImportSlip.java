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
@Table(name = "tblimportslip")
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImportSlip {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36)
    String id;
    
    @Column(name = "date")
    LocalDate date;
    
    @Column(name = "totalPrice", precision = 10)
    Float totalPrice;
    
    @ManyToOne
    @JoinColumn(name = "tblSupplierId", referencedColumnName = "id")
    Supplier supplier;
    
    @ManyToOne
    @JoinColumn(name = "tblWarehouseStaffId", referencedColumnName = "id")
    WarehouseStaff warehouseStaff;
    
    @OneToMany(mappedBy = "importSlip", cascade = CascadeType.ALL)
    List<ImportSlipDetail> importSlipDetails;
    
    public ImportSlip(String id, LocalDate date, Float totalPrice, 
                      Supplier supplier, WarehouseStaff warehouseStaff) {
        this.id = id;
        this.date = date;
        this.totalPrice = totalPrice;
        this.supplier = supplier;
        this.warehouseStaff = warehouseStaff;
    }
}
