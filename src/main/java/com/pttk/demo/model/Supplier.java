package com.pttk.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import java.util.List;

@Entity
@Table(name = "tblsupplier")
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Supplier {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36)
    String id;
    
    @Column(name = "name", length = 255)
    String name;
    
    @Email
    @Column(name = "email", length = 255, unique = true)
    String email;
    
    @Column(name = "address", length = 255)
    String address;
    
    @Column(name = "representative", length = 255)
    String representative;
    
    @Size(max = 15)
    @Column(name = "phone", length = 15)
    String phone;
    
    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL)
    List<ImportSlip> importSlips;
    
    public Supplier(String id, String name, String email, String address,
                    String representative, String phone) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.address = address;
        this.representative = representative;
        this.phone = phone;
    }
}
