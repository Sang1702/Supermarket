package com.pttk.demo.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import java.util.List;

@Entity
@Table(name = "tblcustomer")
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Customer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36)
    String id;
    
    @OneToOne
    @JoinColumn(name = "tblUserId", referencedColumnName = "id")
    User user;
    
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    List<Cart> carts;
    
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    List<OnlineOrder> onlineOrders;
    
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    List<Bill> bills;
    
    public Customer(String id, User user) {
        this.id = id;
        this.user = user;
    }
}
