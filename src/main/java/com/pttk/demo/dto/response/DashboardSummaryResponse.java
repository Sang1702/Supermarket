package com.pttk.demo.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DashboardSummaryResponse {
    // Today's Performance
    Integer ordersToday;
    Float revenueToday;
    Integer newCustomers;
    Float avgOrderValue;

    // Summary
    Float totalRevenue;
    Integer totalOrders;
    Integer products;
    Integer customers;
}
