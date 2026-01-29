package com.pttk.demo.service;

import com.pttk.demo.dto.request.ImportSlipCreationRequest;
import com.pttk.demo.exception.AppException;
import com.pttk.demo.exception.ErrorCode;
import com.pttk.demo.model.ImportSlip;
import com.pttk.demo.model.ImportSlipDetail;
import com.pttk.demo.model.Product;
import com.pttk.demo.model.Supplier;
import com.pttk.demo.model.WarehouseStaff;
import com.pttk.demo.repository.ImportSlipRepository;
import com.pttk.demo.repository.ImportSlipDetailRepository;
import com.pttk.demo.repository.ProductRepository;
import com.pttk.demo.repository.SupplierRepository;
import com.pttk.demo.repository.WarehouseStaffRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ImportSlipService {
    ImportSlipRepository importSlipRepository;
    ImportSlipDetailRepository importSlipDetailRepository;
    SupplierRepository supplierRepository;
    WarehouseStaffRepository warehouseStaffRepository;
    ProductRepository productRepository;

    public List<ImportSlip> getImportSlips() {
        return importSlipRepository.findAll();
    }

    public ImportSlip getImportSlip(String id) {
        return importSlipRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.IMPORT_SLIP_NOT_EXISTED));
    }

    public List<ImportSlip> getImportSlipsBySupplier(String supplierId) {
        return importSlipRepository.findBySupplierId(supplierId);
    }

    @Transactional
    public ImportSlip createImportSlip(ImportSlipCreationRequest request) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new AppException(ErrorCode.SUPPLIER_NOT_EXISTED));

        WarehouseStaff warehouseStaff = warehouseStaffRepository.findById(request.getWarehouseStaffId())
                .orElseThrow(() -> new RuntimeException("Warehouse staff not found"));

        ImportSlip importSlip = new ImportSlip();
        importSlip.setSupplier(supplier);
        importSlip.setWarehouseStaff(warehouseStaff);
        importSlip.setDate(request.getDate() != null ? request.getDate() : LocalDate.now());

        Float totalPrice = 0F;
        if (request.getImportSlipDetails() != null && !request.getImportSlipDetails().isEmpty()) {
            for (var detailRequest : request.getImportSlipDetails()) {
                Product product = productRepository.findById(detailRequest.getProductId())
                        .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));

                ImportSlipDetail detail = new ImportSlipDetail();
                detail.setImportSlip(importSlip);
                detail.setProduct(product);
                detail.setQuantity(detailRequest.getQuantity() != null ? detailRequest.getQuantity() : 1);
                detail.setPrice(detailRequest.getPrice() != null ? detailRequest.getPrice() : product.getImportPrice());

                totalPrice += detail.getPrice() * detail.getQuantity();

                // Update product quantity
                product.setQuantity(product.getQuantity() + detail.getQuantity());
                productRepository.save(product);
            }
        }

        importSlip.setTotalPrice(totalPrice);
        return importSlipRepository.save(importSlip);
    }
}
