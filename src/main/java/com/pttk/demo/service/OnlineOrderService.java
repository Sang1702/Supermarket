package com.pttk.demo.service;

import com.pttk.demo.dto.request.OnlineOrderCreationRequest;
import com.pttk.demo.exception.AppException;
import com.pttk.demo.exception.ErrorCode;
import com.pttk.demo.model.Customer;
import com.pttk.demo.model.OnlineOrder;
import com.pttk.demo.model.OnlineOrderDetail;
import com.pttk.demo.model.Product;
import com.pttk.demo.repository.CustomerRepository;
import com.pttk.demo.repository.OnlineOrderRepository;
import com.pttk.demo.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OnlineOrderService {
    OnlineOrderRepository onlineOrderRepository;
    CustomerRepository customerRepository;
    ProductRepository productRepository;

    public List<OnlineOrder> getOrders() {
        return onlineOrderRepository.findAll();
    }

    public OnlineOrder getOrder(String id) {
        return onlineOrderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_EXISTED));
    }

    public List<OnlineOrder> getOrdersByStatus(String status) {
        return onlineOrderRepository.findByStatus(status);
    }

    public List<OnlineOrder> getOrdersByCustomer(String customerId) {
        return onlineOrderRepository.findByCustomerId(customerId);
    }

    @Transactional
    public OnlineOrder createOrder(OnlineOrderCreationRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_EXISTED));

        OnlineOrder order = new OnlineOrder();
        order.setCustomer(customer);
        order.setStatus(request.getStatus() != null ? request.getStatus() : "New");
        order.setDateTime(request.getDateTime() != null ? request.getDateTime() : LocalDate.now());
        order.setShipAddress(request.getShipAddress());
        order.setReceiverName(request.getReceiverName());
        order.setPhone(request.getPhone());

        Float totalPrice = 0F;
        if (request.getOrderDetails() != null && !request.getOrderDetails().isEmpty()) {
            for (var detailRequest : request.getOrderDetails()) {
                Product product = productRepository.findById(detailRequest.getProductId())
                        .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));

                OnlineOrderDetail detail = new OnlineOrderDetail();
                detail.setOnlineOrder(order);
                detail.setProduct(product);
                detail.setQuantity(detailRequest.getQuantity() != null ? detailRequest.getQuantity() : 1);
                detail.setSalePrice(
                        detailRequest.getSalePrice() != null ? detailRequest.getSalePrice() : product.getSalePrice());

                totalPrice += detail.getSalePrice() * detail.getQuantity();
            }
        }

        order.setTotalPrice(totalPrice);
        return onlineOrderRepository.save(order);
    }

    public OnlineOrder updateOrderStatus(String id, String status) {
        OnlineOrder order = getOrder(id);
        order.setStatus(status);
        return onlineOrderRepository.save(order);
    }
}
