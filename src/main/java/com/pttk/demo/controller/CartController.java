package com.pttk.demo.controller;

import com.pttk.demo.dto.request.AddToCartRequest;
import com.pttk.demo.dto.request.RemoveCartItemRequest;
import com.pttk.demo.dto.request.UpdateCartItemRequest;
import com.pttk.demo.dto.response.CartResponse;
import com.pttk.demo.mapper.CartMapper;
import com.pttk.demo.model.Cart;
import com.pttk.demo.service.CartService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/carts")
public class CartController
{
    CartService cartService;
    CartMapper cartMapper;
    
    @PostMapping
    CartResponse addToCart(@RequestBody AddToCartRequest request)
    {
        Cart cart = cartService.addToCart(request);
        return cartMapper.toCartResponse(cart);
    }
    
    @GetMapping("/{customerId}")
    CartResponse getCart(@PathVariable("customerId") String customerId)
    {
        return cartService.getCart(customerId);
    }

    @PutMapping("/items")
    CartResponse updateCartItem(@RequestBody UpdateCartItemRequest request)
    {
        return cartService.updateCartItem(request);
    }

    @DeleteMapping("/items")
    CartResponse removeCartItem(@RequestBody RemoveCartItemRequest request)
    {
        return cartService.removeCartItem(request);
    }

    @DeleteMapping("/{customerId}")
    CartResponse clearCart(@PathVariable("customerId") String customerId)
    {
        return cartService.clearCart(customerId);
    }
}
