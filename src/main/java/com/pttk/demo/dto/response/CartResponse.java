package com.pttk.demo.dto.response;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import java.util.List;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartResponse {
    String id;
    Float totalPrice;
    String customerId;
    List<CartDetailResponse> cartDetails;
}
