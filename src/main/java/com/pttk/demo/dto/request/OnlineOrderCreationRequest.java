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
public class OnlineOrderCreationRequest {
    @NotBlank
    String customerId;

    String status;

    LocalDate dateTime;

    @NotBlank
    String shipAddress;

    @NotBlank
    String receiverName;

    @NotBlank
    String phone;

    List<OrderDetailRequest> orderDetails;

    @Getter
    @Setter
    @NoArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class OrderDetailRequest {
        @NotBlank
        String productId;

        Integer quantity;

        Float salePrice;
    }
}
