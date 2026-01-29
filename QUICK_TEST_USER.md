# 🚀 Hướng Dẫn Nhanh: Tạo User Mới và Test trên Postman

## Bước 1: Tạo User Mới

### Trong Postman:

1. **Method:** `POST`
2. **URL:** `http://localhost:8080/supermartket/users`
3. **Headers:**
   - Key: `Content-Type`
   - Value: `application/json`
4. **Body (raw JSON):**
```json
{
    "fullName": "Nguyễn Văn A",
    "userName": "nguyenvana",
    "password": "123456",
    "birthDay": "1990-01-15",
    "address": "123 Đường ABC, Quận 1, TP.HCM",
    "email": "nguyenvana@email.com",
    "phone": "0901234567",
    "note": "Khách hàng mới"
}
```

5. **Click Send**

### Response mong đợi (200 OK):
```json
{
    "fullName": "Nguyễn Văn A",
    "userName": "nguyenvana",
    "password": "$2a$10$...",
    "birthDay": "1990-01-15",
    "address": "123 Đường ABC, Quận 1, TP.HCM",
    "email": "nguyenvana@email.com",
    "phone": "0901234567",
    "note": "Khách hàng mới"
}
```

---

## Bước 2: Test Login với User vừa tạo

### Trong Postman:

1. **Method:** `POST`
2. **URL:** `http://localhost:8080/supermartket/auth/token`
3. **Headers:**
   - Key: `Content-Type`
   - Value: `application/json`
4. **Body (raw JSON):**
```json
{
    "userName": "nguyenvana",
    "password": "123456"
}
```

5. **Click Send**

### Response mong đợi (200 OK):
```json
{
    "code": 0,
    "message": null,
    "result": {
        "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJuZ3V5ZW52YW5hIiwiZXhwIjoxNzM3ODk2MDAwfQ...",
        "authenticated": true
    }
}
```

---

## Bước 3: Test các API khác với Token

### Ví dụ: Lấy danh sách Users

1. **Method:** `GET`
2. **URL:** `http://localhost:8080/supermartket/users`
3. **Headers:**
   - Key: `Authorization`
   - Value: `Bearer eyJhbGciOiJIUzUxMiJ9...` (copy token từ bước 2)

---

## ⚠️ Lưu ý:

- **userName**, **email**, **phone** phải là duy nhất
- Nếu tạo user trùng, sẽ báo lỗi: `"User already existed"`
- **password** sẽ được tự động hash, không cần hash trước
- Các field không bắt buộc: `birthDay`, `address`, `note` có thể bỏ qua

---

## 📝 Ví dụ Request Body tối giản (chỉ các field bắt buộc):

```json
{
    "userName": "testuser2",
    "password": "123456",
    "fullName": "Test User 2",
    "email": "test2@email.com",
    "phone": "0901234568"
}
```
