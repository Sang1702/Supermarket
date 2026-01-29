DROP DATABASE IF EXISTS supermarket;
CREATE DATABASE supermarket CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE supermarket;

-- User table (removed role column, will use RBAC)
CREATE TABLE tblUser (
    id VARCHAR(36) PRIMARY KEY,
    fullName VARCHAR(255),
    userName VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    birthDay DATE,
    address VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(15) UNIQUE,
    note VARCHAR(255)
);

-- RBAC Tables
CREATE TABLE tblRole (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(500)
);

CREATE TABLE tblPermission (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    code VARCHAR(100) UNIQUE,
    description VARCHAR(500)
);

CREATE TABLE tblUserRole (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    roleId VARCHAR(36) NOT NULL,
    assignedAt DATETIME,
    isActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (userId) REFERENCES tblUser(id) ON DELETE CASCADE,
    FOREIGN KEY (roleId) REFERENCES tblRole(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_role (userId, roleId)
);

CREATE TABLE tblRolePermission (
    id VARCHAR(36) PRIMARY KEY,
    roleId VARCHAR(36) NOT NULL,
    permissionId VARCHAR(36) NOT NULL,
    assignedAt DATETIME,
    isActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (roleId) REFERENCES tblRole(id) ON DELETE CASCADE,
    FOREIGN KEY (permissionId) REFERENCES tblPermission(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_permission (roleId, permissionId)
);

-- Customer and Staff tables
CREATE TABLE tblCustomer (
    id VARCHAR(36) PRIMARY KEY,
    tblUserid VARCHAR(36),
    FOREIGN KEY (tblUserid) REFERENCES tblUser(id)
);

CREATE TABLE tblStaff (
    id VARCHAR(36) PRIMARY KEY,
    position VARCHAR(255),
    tblUserid VARCHAR(36),
    FOREIGN KEY (tblUserid) REFERENCES tblUser(id)
);

CREATE TABLE tblManagementStaff (
    id VARCHAR(36) PRIMARY KEY,
    tblStaffId VARCHAR(36),
    FOREIGN KEY (tblStaffId) REFERENCES tblStaff(id)
);

CREATE TABLE tblWarehouseStaff (
    id VARCHAR(36) PRIMARY KEY,
    tblStaffId VARCHAR(36),
    FOREIGN KEY (tblStaffId) REFERENCES tblStaff(id)
);

CREATE TABLE tblDeliveryStaff (
    id VARCHAR(36) PRIMARY KEY,
    tblStaffId VARCHAR(36),
    FOREIGN KEY (tblStaffId) REFERENCES tblStaff(id)
);

CREATE TABLE tblSaleStaff (
    id VARCHAR(36) PRIMARY KEY,
    tblStaffId VARCHAR(36),
    FOREIGN KEY (tblStaffId) REFERENCES tblStaff(id)
);

-- Supplier and Product tables
CREATE TABLE tblSupplier (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    address VARCHAR(255),
    representative VARCHAR(255),
    phone VARCHAR(15)
);

CREATE TABLE tblProduct (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    description VARCHAR(255),
    unit VARCHAR(255),
    importPrice FLOAT,
    salePrice FLOAT,
    quantity INT,
    category VARCHAR(255)
);

-- Import Slip tables
CREATE TABLE tblImportSlip (
    id VARCHAR(36) PRIMARY KEY,
    date DATE,
    totalPrice FLOAT,
    tblSupplierId VARCHAR(36),
    tblWarehouseStaffId VARCHAR(36),
    FOREIGN KEY (tblSupplierId) REFERENCES tblSupplier(id),
    FOREIGN KEY (tblWarehouseStaffId) REFERENCES tblWarehouseStaff(id)
);

CREATE TABLE tblImportSlipDetail (
    id VARCHAR(36) PRIMARY KEY,
    quantity INT,
    price FLOAT,
    tblImportSlipId VARCHAR(36),
    tblProductId VARCHAR(36),
    FOREIGN KEY (tblImportSlipId) REFERENCES tblImportSlip(id),
    FOREIGN KEY (tblProductId) REFERENCES tblProduct(id)
);

-- Cart tables
CREATE TABLE tblCart (
    id VARCHAR(36) PRIMARY KEY,
    totalPrice FLOAT,
    tblCustomerId VARCHAR(36),
    FOREIGN KEY (tblCustomerId) REFERENCES tblCustomer(id)
);

CREATE TABLE tblCartDetail (
    id VARCHAR(36) PRIMARY KEY,
    quantity INT,
    tblCartId VARCHAR(36),
    tblProductId VARCHAR(36),
    FOREIGN KEY (tblCartId) REFERENCES tblCart(id),
    FOREIGN KEY (tblProductId) REFERENCES tblProduct(id)
);

-- Online Order tables
CREATE TABLE tblOnlineOrder (
    id VARCHAR(36) PRIMARY KEY UNIQUE,
    status VARCHAR(255),
    dateTime DATE,
    shipAddress VARCHAR(255),
    totalPrice FLOAT,
    tblCustomerId VARCHAR(36),
    receiverName VARCHAR(255),
    phone VARCHAR(15),
    FOREIGN KEY (tblCustomerId) REFERENCES tblCustomer(id)
);

CREATE TABLE tblOnlineOrderDetail (
    id VARCHAR(36) PRIMARY KEY,
    quantity INT,
    salePrice FLOAT,
    tblOnlineOrderId VARCHAR(36),
    tblProductId VARCHAR(36),
    FOREIGN KEY (tblOnlineOrderId) REFERENCES tblOnlineOrder(id),
    FOREIGN KEY (tblProductId) REFERENCES tblProduct(id)
);

CREATE TABLE tblOnlineBill (
    id VARCHAR(36) PRIMARY KEY,
    tblDeliveryStaffId VARCHAR(36),
    tblWarehouseStaffId VARCHAR(36),
    tblOnlineOrderId VARCHAR(36) UNIQUE,
    FOREIGN KEY (tblDeliveryStaffId) REFERENCES tblDeliveryStaff(id),
    FOREIGN KEY (tblWarehouseStaffId) REFERENCES tblWarehouseStaff(id),
    FOREIGN KEY (tblOnlineOrderId) REFERENCES tblOnlineOrder(id)
);

-- Bill tables
CREATE TABLE tblBill (
    id VARCHAR(36) PRIMARY KEY,
    date DATE,
    totalPrice FLOAT,
    paymentMethod VARCHAR(255),
    tblSaleStaffId VARCHAR(36),
    tblCustomerId VARCHAR(36),
    FOREIGN KEY (tblSaleStaffId) REFERENCES tblSaleStaff(id),
    FOREIGN KEY (tblCustomerId) REFERENCES tblCustomer(id)
);

CREATE TABLE tblBillDetail (
    id VARCHAR(36) PRIMARY KEY,
    quantity INT,
    price FLOAT,
    tblBillId VARCHAR(36),
    tblProductId VARCHAR(36),
    FOREIGN KEY (tblBillId) REFERENCES tblBill(id),
    FOREIGN KEY (tblProductId) REFERENCES tblProduct(id)
);
