package com.pttk.demo.repository;

import com.pttk.demo.model.OnlineOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OnlineOrderRepository extends JpaRepository<OnlineOrder, String> {
    List<OnlineOrder> findByCustomerId(String customerId);

    List<OnlineOrder> findByStatus(String status);
}
