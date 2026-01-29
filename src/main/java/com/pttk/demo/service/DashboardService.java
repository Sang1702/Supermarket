package com.pttk.demo.service;

import com.pttk.demo.dto.response.DashboardSummaryResponse;
import com.pttk.demo.model.OnlineOrder;
import com.pttk.demo.model.Product;
import com.pttk.demo.model.User;
import com.pttk.demo.repository.CustomerRepository;
import com.pttk.demo.repository.OnlineOrderRepository;
import com.pttk.demo.repository.ProductRepository;
import com.pttk.demo.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DashboardService {
        OnlineOrderRepository onlineOrderRepository;
        ProductRepository productRepository;
        UserRepository userRepository;
        CustomerRepository customerRepository;

        public DashboardSummaryResponse getSummary() {
                LocalDate today = LocalDate.now();

                // Today's orders
                List<OnlineOrder> todayOrders = onlineOrderRepository.findAll().stream()
                                .filter(order -> order.getDateTime() != null && order.getDateTime().equals(today))
                                .toList();

                Integer ordersToday = todayOrders.size();
                Float revenueToday = todayOrders.stream()
                                .map(order -> order.getTotalPrice() != null ? order.getTotalPrice() : 0F)
                                .reduce(0F, Float::sum);

                // New customers today
                List<User> allUsers = userRepository.findAll();
                Integer newCustomers = (int) allUsers.stream()
                                .filter(user -> user.getCustomer() != null)
                                .count();

                // Average order value
                List<OnlineOrder> allOrders = onlineOrderRepository.findAll();
                Float avgOrderValue = allOrders.isEmpty() ? 0F
                                : allOrders.stream()
                                                .map(order -> order.getTotalPrice() != null ? order.getTotalPrice()
                                                                : 0F)
                                                .reduce(0F, Float::sum) / allOrders.size();

                // Total revenue (from all orders)
                Float totalRevenue = allOrders.stream()
                                .map(order -> order.getTotalPrice() != null ? order.getTotalPrice() : 0F)
                                .reduce(0F, Float::sum);

                Integer totalOrders = allOrders.size();
                Integer products = (int) productRepository.count();
                Integer customers = (int) customerRepository.count();

                return DashboardSummaryResponse.builder()
                                .ordersToday(ordersToday)
                                .revenueToday(revenueToday)
                                .newCustomers(newCustomers)
                                .avgOrderValue(avgOrderValue)
                                .totalRevenue(totalRevenue)
                                .totalOrders(totalOrders)
                                .products(products)
                                .customers(customers)
                                .build();
        }
}
