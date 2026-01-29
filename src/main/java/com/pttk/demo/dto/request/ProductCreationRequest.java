package com.pttk.demo.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class ProductCreationRequest {
    @NotBlank
    String code;

    @NotBlank
    String name;

    String description;

    String unit;

    @NotNull
    @Positive
    Float importPrice;

    @NotNull
    @Positive
    Float salePrice;

    @NotNull
    @Positive
    Integer quantity;

    String category;
}
