package com.pttk.demo.controller;

import com.pttk.demo.dto.request.SupplierCreationRequest;
import com.pttk.demo.dto.request.SupplierUpdateRequest;
import com.pttk.demo.model.Supplier;
import com.pttk.demo.service.SupplierService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/suppliers")
public class SupplierController {
    SupplierService supplierService;

    @GetMapping
    public List<Supplier> getSuppliers() {
        return supplierService.getSuppliers();
    }

    @GetMapping("/{id}")
    public Supplier getSupplier(@PathVariable String id) {
        return supplierService.getSupplier(id);
    }

    @PostMapping
    public Supplier createSupplier(@RequestBody SupplierCreationRequest request) {
        return supplierService.createSupplier(request);
    }

    @PutMapping("/{id}")
    public Supplier updateSupplier(@PathVariable String id, @RequestBody SupplierUpdateRequest request) {
        return supplierService.updateSupplier(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteSupplier(@PathVariable String id) {
        supplierService.deleteSupplier(id);
        return "Supplier has been deleted";
    }

    @GetMapping("/search")
    public List<Supplier> searchSuppliers(@RequestParam("name") String name) {
        return supplierService.searchSuppliers(name);
    }
}
