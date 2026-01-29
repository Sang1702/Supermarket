# Migration Dữ Liệu - Giải Thích Chi Tiết

## 1. Migration là gì?

**Migration (Di chuyển dữ liệu)** là quá trình chuyển đổi cấu trúc database và/hoặc dữ liệu từ phiên bản cũ sang phiên bản mới khi có thay đổi trong thiết kế.

### Ví dụ thực tế:
Giống như khi bạn chuyển nhà:
- **Nhà cũ**: Có 3 phòng, không có gara
- **Nhà mới**: Có 4 phòng, có gara
- **Migration**: Di chuyển đồ đạc từ nhà cũ sang nhà mới, sắp xếp lại theo cấu trúc mới

---

## 2. Tại sao cần Migration?

### Trường hợp của bạn:

#### **TRƯỚC ĐÂY (Thiết kế cũ):**
```sql
CREATE TABLE tblUser (
    id VARCHAR(36) PRIMARY KEY,
    userName VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(255)  -- ← Role được lưu dưới dạng TEXT
);
```

**Dữ liệu mẫu:**
```
id: "user1", userName: "john", role: "ADMIN"
id: "user2", userName: "jane", role: "STAFF"
id: "user3", userName: "bob", role: "CUSTOMER"
```

#### **BÂY GIỜ (Thiết kế mới - RBAC):**
```sql
-- Xóa cột role khỏi tblUser
CREATE TABLE tblUser (
    id VARCHAR(36) PRIMARY KEY,
    userName VARCHAR(255),
    password VARCHAR(255)
    -- KHÔNG CÒN cột role nữa!
);

-- Tạo bảng mới
CREATE TABLE tblRole (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) UNIQUE
);

CREATE TABLE tblUserRole (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36),
    roleId VARCHAR(36)
);
```

**Vấn đề:** Dữ liệu cũ có `role = "ADMIN"` nhưng bảng mới không có cột này nữa!

**Giải pháp:** Cần **MIGRATION** để:
1. Tạo các bảng mới (tblRole, tblUserRole)
2. Chuyển dữ liệu từ cột `role` cũ sang bảng mới
3. Xóa cột `role` cũ

---

## 3. Các loại Migration

### 3.1. **Schema Migration** (Migration cấu trúc)
Thay đổi cấu trúc database: thêm/xóa/sửa bảng, cột, index...

**Ví dụ:**
```sql
-- Thêm cột mới
ALTER TABLE tblUser ADD COLUMN phone VARCHAR(15);

-- Xóa cột
ALTER TABLE tblUser DROP COLUMN role;

-- Thêm bảng mới
CREATE TABLE tblRole (...);
```

### 3.2. **Data Migration** (Migration dữ liệu)
Chuyển đổi dữ liệu từ định dạng cũ sang định dạng mới.

**Ví dụ trong trường hợp của bạn:**

#### Bước 1: Tạo bảng mới
```sql
CREATE TABLE tblRole (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) UNIQUE
);

INSERT INTO tblRole (id, name) VALUES 
    ('role1', 'ADMIN'),
    ('role2', 'STAFF'),
    ('role3', 'CUSTOMER');
```

#### Bước 2: Chuyển dữ liệu từ cột cũ sang bảng mới
```sql
-- Dữ liệu cũ trong tblUser:
-- user1 có role = "ADMIN"
-- user2 có role = "STAFF"

-- Chuyển sang tblUserRole:
INSERT INTO tblUserRole (id, userId, roleId) 
SELECT 
    UUID(),  -- Tạo ID mới
    u.id,    -- Lấy userId
    r.id     -- Lấy roleId dựa trên tên role
FROM tblUser u
JOIN tblRole r ON u.role = r.name;
```

#### Bước 3: Xóa cột cũ
```sql
ALTER TABLE tblUser DROP COLUMN role;
```

---

## 4. Quy trình Migration trong dự án của bạn

### Tình huống hiện tại:

Bạn đang có database cũ với:
- `tblUser` có cột `role VARCHAR(255)`
- Dữ liệu: `user1` có `role = "ADMIN"`, `user2` có `role = "STAFF"`

Bạn muốn chuyển sang:
- `tblUser` KHÔNG có cột `role`
- Dùng bảng `tblRole` và `tblUserRole` thay thế

### Script Migration chi tiết:

```sql
-- ============================================
-- BƯỚC 1: TẠO CẤU TRÚC MỚI
-- ============================================

-- Tạo bảng Role
CREATE TABLE tblRole (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(500)
);

-- Tạo bảng UserRole
CREATE TABLE tblUserRole (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    roleId VARCHAR(36) NOT NULL,
    assignedAt DATETIME DEFAULT NOW(),
    isActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (userId) REFERENCES tblUser(id),
    FOREIGN KEY (roleId) REFERENCES tblRole(id)
);

-- ============================================
-- BƯỚC 2: CHUYỂN DỮ LIỆU
-- ============================================

-- 2.1. Tạo các Role từ dữ liệu cũ
INSERT INTO tblRole (id, name, description)
SELECT DISTINCT 
    UUID() as id,
    role as name,
    CONCAT('Role migrated from old system: ', role) as description
FROM tblUser
WHERE role IS NOT NULL;

-- 2.2. Chuyển quan hệ User-Role từ cột cũ sang bảng mới
INSERT INTO tblUserRole (id, userId, roleId, assignedAt, isActive)
SELECT 
    UUID() as id,
    u.id as userId,
    r.id as roleId,
    NOW() as assignedAt,
    TRUE as isActive
FROM tblUser u
JOIN tblRole r ON u.role = r.name
WHERE u.role IS NOT NULL;

-- ============================================
-- BƯỚC 3: XÓA CẤU TRÚC CŨ
-- ============================================

-- Xóa cột role cũ (SAU KHI ĐÃ CHUYỂN DỮ LIỆU)
ALTER TABLE tblUser DROP COLUMN role;

-- ============================================
-- BƯỚC 4: KIỂM TRA
-- ============================================

-- Kiểm tra số lượng user đã được migrate
SELECT COUNT(*) as total_users FROM tblUser;
SELECT COUNT(*) as total_user_roles FROM tblUserRole;

-- Kiểm tra dữ liệu đã chuyển đúng chưa
SELECT 
    u.userName,
    r.name as role_name
FROM tblUser u
JOIN tblUserRole ur ON u.id = ur.userId
JOIN tblRole r ON ur.roleId = r.id;
```

---

## 5. Các công cụ Migration phổ biến

### 5.1. **Flyway**
- Tự động chạy migration khi ứng dụng khởi động
- Quản lý version của migration
- File: `V1__Create_tables.sql`, `V2__Add_RBAC.sql`

### 5.2. **Liquibase**
- Tương tự Flyway
- Hỗ trợ XML, YAML, SQL

### 5.3. **JPA/Hibernate DDL Auto**
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update  # Tự động cập nhật schema
```

**Lưu ý:** Chỉ dùng trong development, KHÔNG dùng trong production!

### 5.4. **Manual SQL Script** (Như bạn đang dùng)
- Tự viết script SQL
- Chạy thủ công
- Phù hợp cho dự án nhỏ

---

## 6. Best Practices (Thực hành tốt)

### ✅ NÊN LÀM:
1. **Backup database trước khi migration**
   ```sql
   mysqldump -u root -p supermarket > backup_before_migration.sql
   ```

2. **Test migration trên database test trước**
   - Không chạy trực tiếp trên production

3. **Migration theo từng bước nhỏ**
   - Không làm tất cả trong 1 lần
   - Dễ rollback nếu có lỗi

4. **Ghi log lại quá trình migration**
   - Biết được đã làm gì
   - Dễ debug khi có vấn đề

5. **Có kế hoạch rollback**
   - Nếu migration lỗi, có thể quay lại

### ❌ KHÔNG NÊN:
1. **Không backup trước khi migration**
2. **Migration trực tiếp trên production**
3. **Xóa dữ liệu cũ ngay lập tức**
4. **Migration quá nhiều thay đổi cùng lúc**

---

## 7. Ví dụ Migration Script hoàn chỉnh cho dự án của bạn

Tôi sẽ tạo một script migration an toàn hơn, không drop database mà chỉ update:

```sql
-- ============================================
-- MIGRATION SCRIPT: Chuyển từ role String sang RBAC
-- ============================================
-- LƯU Ý: Chạy script này trên database TEST trước!

-- BƯỚC 1: Backup (chạy trong terminal)
-- mysqldump -u root -p supermarket > backup.sql

-- BƯỚC 2: Tạo bảng mới
CREATE TABLE IF NOT EXISTS tblRole (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS tblPermission (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    code VARCHAR(100) UNIQUE,
    description VARCHAR(500)
);

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

-- BƯỚC 3: Tạo các Role từ dữ liệu cũ (nếu có)
-- Giả sử có các role: ADMIN, STAFF, CUSTOMER, MANAGER
INSERT IGNORE INTO tblRole (id, name, description) VALUES
    (UUID(), 'ADMIN', 'Administrator role'),
    (UUID(), 'STAFF', 'Staff role'),
    (UUID(), 'CUSTOMER', 'Customer role'),
    (UUID(), 'MANAGER', 'Manager role');

-- BƯỚC 4: Chuyển dữ liệu từ cột role cũ sang bảng UserRole
-- (CHỈ CHẠY NẾU CÓ DỮ LIỆU CŨ)
INSERT INTO tblUserRole (id, userId, roleId, assignedAt, isActive)
SELECT 
    UUID() as id,
    u.id as userId,
    r.id as roleId,
    NOW() as assignedAt,
    TRUE as isActive
FROM tblUser u
JOIN tblRole r ON u.role = r.name
WHERE u.role IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM tblUserRole ur 
      WHERE ur.userId = u.id AND ur.roleId = r.id
  );

-- BƯỚC 5: Kiểm tra dữ liệu đã chuyển
SELECT 
    'Total Users' as metric,
    COUNT(*) as count
FROM tblUser
UNION ALL
SELECT 
    'Total UserRoles',
    COUNT(*)
FROM tblUserRole
UNION ALL
SELECT 
    'Users without role',
    COUNT(*)
FROM tblUser u
LEFT JOIN tblUserRole ur ON u.id = ur.userId
WHERE ur.id IS NULL;

-- BƯỚC 6: XÓA CỘT CŨ (CHỈ CHẠY SAU KHI ĐÃ KIỂM TRA)
-- ALTER TABLE tblUser DROP COLUMN role;

-- BƯỚC 7: Rollback nếu cần (khôi phục từ backup)
-- mysql -u root -p supermarket < backup.sql
```

---

## 8. Tóm tắt

### Migration là gì?
→ Quá trình chuyển đổi cấu trúc và dữ liệu database từ phiên bản cũ sang mới

### Tại sao cần?
→ Khi thay đổi thiết kế database (thêm/xóa/sửa bảng, cột) mà vẫn muốn giữ dữ liệu cũ

### Các bước cơ bản:
1. **Backup** dữ liệu cũ
2. **Tạo** cấu trúc mới
3. **Chuyển** dữ liệu từ cũ sang mới
4. **Kiểm tra** dữ liệu đã chuyển đúng
5. **Xóa** cấu trúc cũ (nếu cần)
6. **Rollback** nếu có lỗi

### Trong trường hợp của bạn:
- **Cũ**: `tblUser.role = "ADMIN"` (String)
- **Mới**: `tblUserRole` → `tblRole` (RBAC)
- **Migration**: Chuyển "ADMIN" từ cột `role` sang bảng `tblUserRole` và `tblRole`
