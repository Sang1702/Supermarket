package com.pttk.demo.repository;

import com.pttk.demo.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findAllByNameContainingIgnoreCase(String name);

    boolean existsByCode(String code);

    Optional<Product> findByCode(String code);
}
