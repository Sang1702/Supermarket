package com.pttk.demo.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImportSlipCreationRequest {
    @NotBlank
    String supplierId;

    @NotBlank
    String warehouseStaffId;

    LocalDate date;

    List<ImportSlipDetailRequest> importSlipDetails;

    @Getter
    @Setter
    @NoArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class ImportSlipDetailRequest {
        @NotBlank
        String productId;

        Integer quantity;

        Float price;
    }
}
