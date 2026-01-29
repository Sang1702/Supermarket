package com.pttk.demo.mapper;

import com.pttk.demo.dto.response.CartDetailResponse;
import com.pttk.demo.dto.response.CartResponse;
import com.pttk.demo.model.Cart;
import com.pttk.demo.model.CartDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CartMapper {
    
    @Mapping(source = "customer.id", target = "customerId")
    @Mapping(source = "cartDetails", target = "cartDetails")
    CartResponse toCartResponse(Cart cart);
    
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "product.salePrice", target = "productPrice")
    @Mapping(target = "subtotal", expression = "java(detail.getProduct().getSalePrice() * detail.getQuantity())")
    CartDetailResponse toCartDetailResponse(CartDetail detail);
    
    List<CartDetailResponse> toCartDetailResponseList(List<CartDetail> details);
}
