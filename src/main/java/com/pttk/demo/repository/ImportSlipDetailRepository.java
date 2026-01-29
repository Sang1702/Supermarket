package com.pttk.demo.repository;

import com.pttk.demo.model.ImportSlipDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImportSlipDetailRepository extends JpaRepository<ImportSlipDetail, String> {
}
