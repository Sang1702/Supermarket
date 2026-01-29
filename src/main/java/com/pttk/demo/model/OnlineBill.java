package com.pttk.demo.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "tblonlinebill")
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OnlineBill {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36)
    String id;
    
    @ManyToOne
    @JoinColumn(name = "tblDeliveryStaffId", referencedColumnName = "id")
    DeliveryStaff deliveryStaff;
    
    @ManyToOne
    @JoinColumn(name = "tblWarehouseStaffId", referencedColumnName = "id")
    WarehouseStaff warehouseStaff;
    
    @OneToOne
    @JoinColumn(name = "tblOnlineOrderId", referencedColumnName = "id")
    OnlineOrder onlineOrder;
    
    public OnlineBill(String id, DeliveryStaff deliveryStaff, 
                      WarehouseStaff warehouseStaff, OnlineOrder onlineOrder) {
        this.id = id;
        this.deliveryStaff = deliveryStaff;
        this.warehouseStaff = warehouseStaff;
        this.onlineOrder = onlineOrder;
    }
}
