package com.pttk.demo.service;

import com.pttk.demo.dto.request.AddToCartRequest;
import com.pttk.demo.dto.request.RemoveCartItemRequest;
import com.pttk.demo.dto.request.UpdateCartItemRequest;
import com.pttk.demo.dto.response.CartResponse;
import com.pttk.demo.exception.AppException;
import com.pttk.demo.exception.ErrorCode;
import com.pttk.demo.mapper.CartMapper;
import com.pttk.demo.model.Cart;
import com.pttk.demo.model.CartDetail;
import com.pttk.demo.model.Customer;
import com.pttk.demo.model.Product;
import com.pttk.demo.repository.CartDetailRepository;
import com.pttk.demo.repository.CartRepository;
import com.pttk.demo.repository.CustomerRepository;
import com.pttk.demo.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartService
{
    CartRepository cartRepository;
    CartDetailRepository cartDetailRepository;
    ProductRepository productRepository;
    CustomerRepository customerRepository;
    CartMapper cartMapper;

    public Cart addToCart(AddToCartRequest request)
    {
        Cart cart = cartRepository.findByCustomerId(request.getCustomerId())
                .orElseGet(() ->
                {
                    Customer customer = customerRepository.findById(request.getCustomerId())
                            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
                    Cart newCart = new Cart();
                    newCart.setCustomer(customer);
                    newCart.setTotalPrice(0F);
                    return cartRepository.save(newCart);
                });

        //Search Product
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        //Checking inventory
        if (product.getQuantity() < request.getQuantity())
        {
            throw new RuntimeException("Product quantity less than request quantity");
        }

        //Checking cartDetail
        Optional<CartDetail> existingDetail = cartDetailRepository.findByCartIdAndProductId(cart.getId(), request.getProductId());

        CartDetail cartDetail;
        if (existingDetail.isPresent())
        {
            cartDetail = existingDetail.get();
            cartDetail.setQuantity(cartDetail.getQuantity() + request.getQuantity());
        }else {
            cartDetail = new CartDetail();
            cartDetail.setCart(cart);
            cartDetail.setProduct(product);
            cartDetail.setQuantity(request.getQuantity());
        }
        cartDetailRepository.save(cartDetail);

        // Refresh cart để load cartDetails
        cart = cartRepository.findById(cart.getId()).orElse(cart);
        Float totalPrice = 0F;
        if (cart.getCartDetails() != null) {
            totalPrice = cart.getCartDetails().stream()
                    .map(detail -> detail.getProduct().getSalePrice() * detail.getQuantity())
                    .reduce(0F, Float::sum);
        }
        cart.setTotalPrice(totalPrice);
        cart = cartRepository.save(cart);
        
        return cart;
    }
    
    public CartResponse getCart(String customerId) {
        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        return cartMapper.toCartResponse(cart);
    }

    @Transactional
    public CartResponse updateCartItem(UpdateCartItemRequest request) {
        Cart cart = cartRepository.findByCustomerId(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Kiểm tra số lượng trong kho
        if (product.getQuantity() < request.getQuantity()) {
            throw new RuntimeException("Product quantity less than request quantity");
        }

        CartDetail cartDetail = cartDetailRepository.findByCartIdAndProductId(cart.getId(), request.getProductId())
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cartDetail.setQuantity(request.getQuantity());
        cartDetailRepository.save(cartDetail);

        // Tính lại totalPrice
        recalculateCartTotal(cart);

        return cartMapper.toCartResponse(cart);
    }

    @Transactional
    public CartResponse removeCartItem(RemoveCartItemRequest request) {
        Cart cart = cartRepository.findByCustomerId(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartDetail cartDetail = cartDetailRepository.findByCartIdAndProductId(cart.getId(), request.getProductId())
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cartDetailRepository.delete(cartDetail);

        // Tính lại totalPrice
        recalculateCartTotal(cart);

        return cartMapper.toCartResponse(cart);
    }

    @Transactional
    public CartResponse clearCart(String customerId) {
        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getCartDetails() != null && !cart.getCartDetails().isEmpty()) {
            cartDetailRepository.deleteAll(cart.getCartDetails());
        }

        cart.setTotalPrice(0F);
        cart = cartRepository.save(cart);

        return cartMapper.toCartResponse(cart);
    }

    private void recalculateCartTotal(Cart cart) {
        // Lấy tất cả cartDetails của cart này
        List<CartDetail> cartDetails = cartDetailRepository.findByCartId(cart.getId());
        
        Float totalPrice = 0F;
        if (cartDetails != null && !cartDetails.isEmpty()) {
            totalPrice = cartDetails.stream()
                    .map(detail -> detail.getProduct().getSalePrice() * detail.getQuantity())
                    .reduce(0F, Float::sum);
        }
        cart.setTotalPrice(totalPrice);
        cartRepository.save(cart);
    }
}
