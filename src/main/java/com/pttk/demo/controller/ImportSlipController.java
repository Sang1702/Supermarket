package com.pttk.demo.controller;

import com.pttk.demo.dto.request.ImportSlipCreationRequest;
import com.pttk.demo.model.ImportSlip;
import com.pttk.demo.service.ImportSlipService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/import-slips")
public class ImportSlipController {
    ImportSlipService importSlipService;

    @GetMapping
    public List<ImportSlip> getImportSlips() {
        return importSlipService.getImportSlips();
    }

    @GetMapping("/{id}")
    public ImportSlip getImportSlip(@PathVariable String id) {
        return importSlipService.getImportSlip(id);
    }

    @GetMapping("/supplier/{supplierId}")
    public List<ImportSlip> getImportSlipsBySupplier(@PathVariable String supplierId) {
        return importSlipService.getImportSlipsBySupplier(supplierId);
    }

    @PostMapping
    public ImportSlip createImportSlip(@RequestBody ImportSlipCreationRequest request) {
        return importSlipService.createImportSlip(request);
    }
}
