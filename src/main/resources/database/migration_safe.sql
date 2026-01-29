-- ============================================
-- MIGRATION SCRIPT: Chuyển từ role String sang RBAC
-- Script này AN TOÀN - không drop database, chỉ update
-- ============================================
-- 
-- HƯỚNG DẪN SỬ DỤNG:
-- 1. BACKUP database trước: mysqldump -u root -p supermarket > backup.sql
-- 2. Chạy script này trên database TEST trước
-- 3. Kiểm tra kỹ trước khi chạy trên production
--
-- ============================================

USE supermarket;

-- ============================================
-- BƯỚC 1: TẠO CẤU TRÚC MỚI (RBAC Tables)
-- ============================================

-- Tạo bảng Role
CREATE TABLE IF NOT EXISTS tblRole (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(500)
);

-- Tạo bảng Permission
CREATE TABLE IF NOT EXISTS tblPermission (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    code VARCHAR(100) UNIQUE,
    description VARCHAR(500)
);

-- Tạo bảng UserRole (Many-to-Many: User ↔ Role)
CREATE TABLE IF NOT EXISTS tblUserRole (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    roleId VARCHAR(36) NOT NULL,
    assignedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    isActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (userId) REFERENCES tblUser(id) ON DELETE CASCADE,
    FOREIGN KEY (roleId) REFERENCES tblRole(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_role (userId, roleId)
);

-- Tạo bảng RolePermission (Many-to-Many: Role ↔ Permission)
CREATE TABLE IF NOT EXISTS tblRolePermission (
    id VARCHAR(36) PRIMARY KEY,
    roleId VARCHAR(36) NOT NULL,
    permissionId VARCHAR(36) NOT NULL,
    assignedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    isActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (roleId) REFERENCES tblRole(id) ON DELETE CASCADE,
    FOREIGN KEY (permissionId) REFERENCES tblPermission(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_permission (roleId, permissionId)
);

-- ============================================
-- BƯỚC 2: TẠO DỮ LIỆU ROLE MẪU
-- ============================================

-- Tạo các Role phổ biến
INSERT IGNORE INTO tblRole (id, name, description) VALUES
    ('role-admin-001', 'ADMIN', 'Administrator - Full system access'),
    ('role-staff-001', 'STAFF', 'Staff - General staff access'),
    ('role-customer-001', 'CUSTOMER', 'Customer - Basic customer access'),
    ('role-manager-001', 'MANAGER', 'Manager - Management access'),
    ('role-sale-001', 'SALE_STAFF', 'Sale Staff - Sales operations'),
    ('role-warehouse-001', 'WAREHOUSE_STAFF', 'Warehouse Staff - Inventory'),
    ('role-delivery-001', 'DELIVERY_STAFF', 'Delivery Staff - Delivery operations');

-- ============================================
-- BƯỚC 3: CHUYỂN DỮ LIỆU TỪ CỘT ROLE CŨ SANG BẢNG MỚI
-- ============================================
-- 
-- LƯU Ý: Chỉ chạy phần này nếu:
-- 1. Bảng tblUser đã có cột "role" 
-- 2. Có dữ liệu trong cột "role"
-- 3. Muốn giữ lại dữ liệu cũ

-- Kiểm tra xem có cột role không
-- SELECT COLUMN_NAME 
-- FROM INFORMATION_SCHEMA.COLUMNS 
-- WHERE TABLE_SCHEMA = 'supermarket' 
--   AND TABLE_NAME = 'tblUser' 
--   AND COLUMN_NAME = 'role';

-- Chuyển dữ liệu từ cột role cũ sang bảng UserRole
INSERT INTO tblUserRole (id, userId, roleId, assignedAt, isActive)
SELECT 
    CONCAT('ur-', UUID()) as id,
    u.id as userId,
    r.id as roleId,
    NOW() as assignedAt,
    TRUE as isActive
FROM tblUser u
INNER JOIN tblRole r ON UPPER(TRIM(u.role)) = UPPER(TRIM(r.name))
WHERE u.role IS NOT NULL 
  AND u.role != ''
  AND NOT EXISTS (
      SELECT 1 FROM tblUserRole ur 
      WHERE ur.userId = u.id AND ur.roleId = r.id
  );

-- ============================================
-- BƯỚC 4: KIỂM TRA DỮ LIỆU ĐÃ CHUYỂN
-- ============================================

-- Kiểm tra số lượng
SELECT 
    'Total Users' as metric,
    COUNT(*) as count
FROM tblUser
UNION ALL
SELECT 
    'Total Roles',
    COUNT(*)
FROM tblRole
UNION ALL
SELECT 
    'Total UserRoles (mapped)',
    COUNT(*)
FROM tblUserRole
UNION ALL
SELECT 
    'Users without role (cần xử lý)',
    COUNT(*)
FROM tblUser u
LEFT JOIN tblUserRole ur ON u.id = ur.userId
WHERE ur.id IS NULL;

-- Kiểm tra chi tiết user và role của họ
SELECT 
    u.id as user_id,
    u.userName,
    u.role as old_role,  -- Cột cũ (sẽ xóa sau)
    r.name as new_role,   -- Role mới từ bảng
    ur.assignedAt,
    ur.isActive
FROM tblUser u
LEFT JOIN tblUserRole ur ON u.id = ur.userId
LEFT JOIN tblRole r ON ur.roleId = r.id
ORDER BY u.userName;

-- ============================================
-- BƯỚC 5: XÓA CỘT ROLE CŨ (CHỈ CHẠY SAU KHI ĐÃ KIỂM TRA KỸ!)
-- ============================================
--
-- CẢNH BÁO: 
-- - Chỉ chạy sau khi đã kiểm tra dữ liệu đã chuyển đúng
-- - Đảm bảo không còn user nào thiếu role trong tblUserRole
-- - Đã backup database
--
-- ALTER TABLE tblUser DROP COLUMN role;

-- ============================================
-- BƯỚC 6: ROLLBACK (Nếu cần khôi phục)
-- ============================================
--
-- Nếu migration có vấn đề, khôi phục từ backup:
-- mysql -u root -p supermarket < backup.sql
--
-- Hoặc xóa các bảng mới:
-- DROP TABLE IF EXISTS tblRolePermission;
-- DROP TABLE IF EXISTS tblUserRole;
-- DROP TABLE IF EXISTS tblPermission;
-- DROP TABLE IF EXISTS tblRole;
