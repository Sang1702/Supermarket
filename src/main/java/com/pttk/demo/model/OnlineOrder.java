package com.pttk.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "tblonlineorder")
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OnlineOrder {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36, unique = true)
    String id;
    
    @Column(name = "status", length = 255)
    String status;
    
    @Column(name = "dateTime")
    LocalDate dateTime;
    
    @Column(name = "shipAddress", length = 255)
    String shipAddress;
    
    @Column(name = "totalPrice", precision = 10)
    Float totalPrice;
    
    @ManyToOne
    @JoinColumn(name = "tblCustomerId", referencedColumnName = "id")
    Customer customer;
    
    @Column(name = "receiverName", length = 255)
    String receiverName;
    
    @Size(max = 15)
    @Column(name = "phone", length = 15)
    String phone;
    
    @OneToMany(mappedBy = "onlineOrder", cascade = CascadeType.ALL)
    List<OnlineOrderDetail> onlineOrderDetails;
    
    @OneToOne(mappedBy = "onlineOrder", cascade = CascadeType.ALL)
    OnlineBill onlineBill;
    
    public OnlineOrder(String id, String status, LocalDate dateTime, 
                       String shipAddress, Float totalPrice, Customer customer,
                       String receiverName, String phone) {
        this.id = id;
        this.status = status;
        this.dateTime = dateTime;
        this.shipAddress = shipAddress;
        this.totalPrice = totalPrice;
        this.customer = customer;
        this.receiverName = receiverName;
        this.phone = phone;
    }
}
