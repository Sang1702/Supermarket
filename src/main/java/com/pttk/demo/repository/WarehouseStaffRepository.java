package com.pttk.demo.repository;

import com.pttk.demo.model.WarehouseStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WarehouseStaffRepository extends JpaRepository<WarehouseStaff, String> {
}
