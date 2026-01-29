package com.pttk.demo.exception;

public enum ErrorCode {
    USER_EXISTED(1001, "User already exists"),
    USER_NOT_EXISTED(1002, "User not found"),
    UNAUTHENTICATED(1003, "Unauthenticated"),
    PRODUCT_EXISTED(2001, "Product already exists"),
    PRODUCT_NOT_EXISTED(2002, "Product not found"),
    CUSTOMER_NOT_EXISTED(3001, "Customer not found"),
    STAFF_NOT_EXISTED(4001, "Staff not found"),
    SUPPLIER_NOT_EXISTED(5001, "Supplier not found"),
    ORDER_NOT_EXISTED(6001, "Order not found"),
    IMPORT_SLIP_NOT_EXISTED(7001, "Import slip not found"),
    ;

    private int code;
    private String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
