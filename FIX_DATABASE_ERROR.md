# 🔧 Sửa Lỗi: Table 'supermarket.tbl_user' doesn't exist

## ❌ Lỗi hiện tại:
```
java.sql.SQLSyntaxErrorException: Table 'supermarket.tbl_user' doesn't exist
```

**Nguyên nhân:** Database chưa được tạo. Bạn cần chạy migration script trước.

---

## ✅ Giải pháp: Chạy Migration Script

### Cách 1: Dùng Script PowerShell (Khuyến nghị - Dễ nhất)

1. **Mở PowerShell** trong thư mục project:
   ```powershell
   cd C:\Users\ASUS\Workspace\javaProject\demo\demo
   ```

2. **Chạy script migration:**
   ```powershell
   .\run-migration.ps1
   ```

3. **Nhập thông tin:**
   - MySQL username: `root` (hoặc username của bạn)
   - MySQL password: Nhập password MySQL

4. **Đợi script chạy xong** - sẽ hiển thị "✅ Migration thành công!"

5. **Restart Spring Boot application**

6. **Test lại API trên Postman**

---

### Cách 2: Dùng MySQL Workbench (Dễ nhất nếu đã cài)

1. Mở **MySQL Workbench**
2. Kết nối đến MySQL server (localhost)
3. Click **File** → **Open SQL Script**
4. Chọn file: `src/main/resources/database/migration.sql`
5. Click **Execute** (hoặc nhấn `Ctrl+Shift+Enter`)
6. Xem kết quả ở tab **Output**
7. Restart Spring Boot application

---

### Cách 3: Dùng PowerShell Command (Thủ công)

```powershell
# Trong PowerShell
Get-Content src/main/resources/database/migration.sql | mysql -u root -p
```

Sau đó nhập password khi được hỏi.

---

### Cách 4: Dùng CMD (Windows Command Prompt)

1. Mở **CMD** (Win + R → gõ `cmd`)
2. `cd C:\Users\ASUS\Workspace\javaProject\demo\demo`
3. `mysql -u root -p < src/main/resources/database/migration.sql`
4. Nhập password

---

## 📋 Sau khi chạy migration:

### 1. Kiểm tra database đã tạo:
```sql
-- Mở MySQL Workbench hoặc MySQL Command Line
SHOW DATABASES;
USE supermarket;
SHOW TABLES;
```

Bạn sẽ thấy các bảng:
- `tblUser`
- `tblRole`
- `tblPermission`
- `tblUserRole`
- `tblRolePermission`
- `tblCustomer`
- `tblStaff`
- ... và các bảng khác

### 2. (Tùy chọn) Chạy seed data:
```powershell
.\run-seed-data.ps1
```

Hoặc:
```powershell
Get-Content src/main/resources/database/seed_data.sql | mysql -u root -p supermarket
```

### 3. Restart Spring Boot application

### 4. Test lại API trên Postman:
```
POST http://localhost:8080/supermartket/users
Content-Type: application/json

{
    "fullName": "Nguyễn Văn A",
    "userName": "nguyenvana",
    "password": "123456",
    "email": "nguyenvana@email.com",
    "phone": "0901234567"
}
```

---

## 🔍 Kiểm tra MySQL đã cài đặt chưa:

```powershell
mysql --version
```

Nếu không có, cần:
- Cài đặt MySQL Server
- Hoặc thêm MySQL vào PATH environment variable

---

## ⚠️ Lưu ý quan trọng:

1. **Migration script sẽ DROP database cũ** (nếu có) và tạo mới
2. **Nếu đã có dữ liệu quan trọng**, hãy backup trước
3. **Sau khi migration**, cần restart Spring Boot application
4. **Seed data** là tùy chọn, chỉ cần nếu muốn có dữ liệu mẫu

---

## 🚀 Quick Start:

```powershell
# 1. Chạy migration
.\run-migration.ps1

# 2. (Tùy chọn) Chạy seed data
.\run-seed-data.ps1

# 3. Restart Spring Boot

# 4. Test trên Postman
```
