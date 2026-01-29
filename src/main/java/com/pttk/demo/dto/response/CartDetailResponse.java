package com.pttk.demo.dto.response;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartDetailResponse {
    String id;
    Integer quantity;
    String productId;
    String productName;
    Float productPrice;
    Float subtotal;
}
