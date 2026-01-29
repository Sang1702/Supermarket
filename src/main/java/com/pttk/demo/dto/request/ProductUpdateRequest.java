package com.pttk.demo.dto.request;

import jakarta.validation.constraints.Positive;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductUpdateRequest {
    String code;
    String name;
    String description;
    String unit;
    @Positive
    Float importPrice;
    @Positive
    Float salePrice;
    @Positive
    Integer quantity;
    String category;
}
