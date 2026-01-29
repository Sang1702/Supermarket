package com.pttk.demo.controller;

import com.pttk.demo.dto.request.OnlineOrderCreationRequest;
import com.pttk.demo.model.OnlineOrder;
import com.pttk.demo.service.OnlineOrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/orders")
public class OnlineOrderController {
    OnlineOrderService onlineOrderService;

    @GetMapping
    public List<OnlineOrder> getOrders() {
        return onlineOrderService.getOrders();
    }

    @GetMapping("/{id}")
    public OnlineOrder getOrder(@PathVariable String id) {
        return onlineOrderService.getOrder(id);
    }

    @GetMapping("/status/{status}")
    public List<OnlineOrder> getOrdersByStatus(@PathVariable String status) {
        return onlineOrderService.getOrdersByStatus(status);
    }

    @GetMapping("/customer/{customerId}")
    public List<OnlineOrder> getOrdersByCustomer(@PathVariable String customerId) {
        return onlineOrderService.getOrdersByCustomer(customerId);
    }

    @PostMapping
    public OnlineOrder createOrder(@RequestBody OnlineOrderCreationRequest request) {
        return onlineOrderService.createOrder(request);
    }

    @PutMapping("/{id}/status")
    public OnlineOrder updateOrderStatus(@PathVariable String id, @RequestBody String status) {
        return onlineOrderService.updateOrderStatus(id, status);
    }
}
