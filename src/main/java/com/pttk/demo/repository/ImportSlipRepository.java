package com.pttk.demo.repository;

import com.pttk.demo.model.ImportSlip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImportSlipRepository extends JpaRepository<ImportSlip, String> {
    List<ImportSlip> findBySupplierId(String supplierId);

    List<ImportSlip> findByWarehouseStaffId(String warehouseStaffId);
}
