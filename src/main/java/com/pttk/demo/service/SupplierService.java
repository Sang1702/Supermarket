package com.pttk.demo.service;

import com.pttk.demo.dto.request.SupplierCreationRequest;
import com.pttk.demo.dto.request.SupplierUpdateRequest;
import com.pttk.demo.exception.AppException;
import com.pttk.demo.exception.ErrorCode;
import com.pttk.demo.model.Supplier;
import com.pttk.demo.repository.SupplierRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupplierService {
    SupplierRepository supplierRepository;

    public List<Supplier> getSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier getSupplier(String id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SUPPLIER_NOT_EXISTED));
    }

    public Supplier createSupplier(SupplierCreationRequest request) {
        if (supplierRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        Supplier supplier = new Supplier();
        supplier.setName(request.getName());
        supplier.setEmail(request.getEmail());
        supplier.setAddress(request.getAddress());
        supplier.setRepresentative(request.getRepresentative());
        supplier.setPhone(request.getPhone());

        return supplierRepository.save(supplier);
    }

    public Supplier updateSupplier(String id, SupplierUpdateRequest request) {
        Supplier supplier = getSupplier(id);

        if (request.getName() != null)
            supplier.setName(request.getName());
        if (request.getEmail() != null)
            supplier.setEmail(request.getEmail());
        if (request.getAddress() != null)
            supplier.setAddress(request.getAddress());
        if (request.getRepresentative() != null)
            supplier.setRepresentative(request.getRepresentative());
        if (request.getPhone() != null)
            supplier.setPhone(request.getPhone());

        return supplierRepository.save(supplier);
    }

    public void deleteSupplier(String id) {
        Supplier supplier = getSupplier(id);
        supplierRepository.delete(supplier);
    }

    public List<Supplier> searchSuppliers(String name) {
        return supplierRepository.findByNameContainingIgnoreCase(name);
    }
}
