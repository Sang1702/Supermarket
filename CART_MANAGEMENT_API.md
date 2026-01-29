# 🛒 Hướng Dẫn API Quản Lý Giỏ Hàng

## 📋 Tổng Quan Các API

1. **POST /carts** - Thêm sản phẩm vào giỏ hàng (đã có)
2. **GET /carts/{customerId}** - Xem giỏ hàng (đã có)
3. **PUT /carts/items** - Cập nhật số lượng sản phẩm (MỚI)
4. **DELETE /carts/items** - Xóa sản phẩm khỏi giỏ hàng (MỚI)
5. **DELETE /carts/{customerId}** - Xóa toàn bộ giỏ hàng (MỚI)

---

## ⚠️ QUAN TRỌNG: Cần Authentication

Tất cả các API đều yêu cầu token. Bạn phải login trước:

```
POST http://localhost:8080/supermartket/auth/token
Content-Type: application/json

{
    "userName": "nguyenvana",
    "password": "123456"
}
```

→ Copy token và dùng trong header: `Authorization: Bearer {token}`

---

## 1. Thêm Sản Phẩm Vào Giỏ Hàng

**Endpoint:**
```
POST http://localhost:8080/supermartket/carts
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body:**
```json
{
    "customerId": "d4000004-0004-0004-0004-000000000001",
    "productId": "h8000008-0008-0008-0008-000000000001",
    "quantity": 2
}
```

**Response:**
```json
{
    "id": "xxx-xxx-xxx",
    "totalPrice": 250000.0,
    "customerId": "d4000004-0004-0004-0004-000000000001",
    "cartDetails": [
        {
            "id": "yyy-yyy-yyy",
            "quantity": 2,
            "productId": "h8000008-0008-0008-0008-000000000001",
            "productName": "Gạo ST25 5kg",
            "productPrice": 125000.0,
            "subtotal": 250000.0
        }
    ]
}
```

**Lưu ý:** Nếu sản phẩm đã có trong giỏ hàng, số lượng sẽ được **cộng dồn**.

---

## 2. Xem Giỏ Hàng

**Endpoint:**
```
GET http://localhost:8080/supermartket/carts/{customerId}
```

**Ví dụ:**
```
GET http://localhost:8080/supermartket/carts/d4000004-0004-0004-0004-000000000001
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
    "id": "xxx-xxx-xxx",
    "totalPrice": 250000.0,
    "customerId": "d4000004-0004-0004-0004-000000000001",
    "cartDetails": [
        {
            "id": "yyy-yyy-yyy",
            "quantity": 2,
            "productId": "h8000008-0008-0008-0008-000000000001",
            "productName": "Gạo ST25 5kg",
            "productPrice": 125000.0,
            "subtotal": 250000.0
        }
    ]
}
```

---

## 3. Cập Nhật Số Lượng Sản Phẩm (MỚI)

**Endpoint:**
```
PUT http://localhost:8080/supermartket/carts/items
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body:**
```json
{
    "customerId": "d4000004-0004-0004-0004-000000000001",
    "productId": "h8000008-0008-0008-0008-000000000001",
    "quantity": 5
}
```

**Response:**
```json
{
    "id": "xxx-xxx-xxx",
    "totalPrice": 625000.0,
    "customerId": "d4000004-0004-0004-0004-000000000001",
    "cartDetails": [
        {
            "id": "yyy-yyy-yyy",
            "quantity": 5,
            "productId": "h8000008-0008-0008-0008-000000000001",
            "productName": "Gạo ST25 5kg",
            "productPrice": 125000.0,
            "subtotal": 625000.0
        }
    ]
}
```

**Lưu ý:**
- Số lượng sẽ được **thay thế** (không cộng dồn như POST)
- Phải kiểm tra số lượng trong kho (quantity phải <= product.quantity)
- `totalPrice` sẽ được tự động tính lại

---

## 4. Xóa Sản Phẩm Khỏi Giỏ Hàng (MỚI)

**Endpoint:**
```
DELETE http://localhost:8080/supermartket/carts/items
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body:**
```json
{
    "customerId": "d4000004-0004-0004-0004-000000000001",
    "productId": "h8000008-0008-0008-0008-000000000001"
}
```

**Response:**
```json
{
    "id": "xxx-xxx-xxx",
    "totalPrice": 0.0,
    "customerId": "d4000004-0004-0004-0004-000000000001",
    "cartDetails": []
}
```

**Lưu ý:**
- Sản phẩm sẽ bị xóa hoàn toàn khỏi giỏ hàng
- `totalPrice` sẽ được tự động tính lại
- Nếu giỏ hàng trống, `totalPrice = 0`

---

## 5. Xóa Toàn Bộ Giỏ Hàng (MỚI)

**Endpoint:**
```
DELETE http://localhost:8080/supermartket/carts/{customerId}
```

**Ví dụ:**
```
DELETE http://localhost:8080/supermartket/carts/d4000004-0004-0004-0004-000000000001
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
    "id": "xxx-xxx-xxx",
    "totalPrice": 0.0,
    "customerId": "d4000004-0004-0004-0004-000000000001",
    "cartDetails": []
}
```

**Lưu ý:**
- Tất cả sản phẩm trong giỏ hàng sẽ bị xóa
- Giỏ hàng vẫn tồn tại nhưng trống
- `totalPrice = 0`

---

## 📝 Dữ Liệu Mẫu

### Customer IDs:
- `d4000004-0004-0004-0004-000000000001` - Nguyễn Văn An
- `d4000004-0004-0004-0004-000000000002` - Trần Thị Bình
- `d4000004-0004-0004-0004-000000000003` - Lê Văn Cường

### Product IDs:
- `h8000008-0008-0008-0008-000000000001` - Gạo ST25 5kg (125,000 VNĐ, còn 200)
- `h8000008-0008-0008-0008-000000000002` - Dầu ăn Simply 1L (58,000 VNĐ, còn 150)
- `h8000008-0008-0008-0008-000000000003` - Sữa Vinamilk 1L (28,000 VNĐ, còn 300)
- `h8000008-0008-0008-0008-000000000004` - Mì Hảo Hảo 75g (4,500 VNĐ, còn 500)
- `h8000008-0008-0008-0008-000000000005` - Nước suối Lavie 500ml (3,500 VNĐ, còn 600)

---

## 🔄 Quy Trình Test Đầy Đủ

### Bước 1: Login và lấy token
```
POST http://localhost:8080/supermartket/auth/token
{
    "userName": "nguyenvana",
    "password": "123456"
}
```

### Bước 2: Thêm sản phẩm 1
```
POST http://localhost:8080/supermartket/carts
{
    "customerId": "d4000004-0004-0004-0004-000000000001",
    "productId": "h8000008-0008-0008-0008-000000000001",
    "quantity": 2
}
```
→ Giỏ hàng có 2 Gạo ST25, totalPrice = 250,000

### Bước 3: Thêm sản phẩm 2
```
POST http://localhost:8080/supermartket/carts
{
    "customerId": "d4000004-0004-0004-0004-000000000001",
    "productId": "h8000008-0008-0008-0008-000000000002",
    "quantity": 1
}
```
→ Giỏ hàng có 2 Gạo + 1 Dầu ăn, totalPrice = 308,000

### Bước 4: Cập nhật số lượng Gạo
```
PUT http://localhost:8080/supermartket/carts/items
{
    "customerId": "d4000004-0004-0004-0004-000000000001",
    "productId": "h8000008-0008-0008-0008-000000000001",
    "quantity": 5
}
```
→ Giỏ hàng có 5 Gạo + 1 Dầu ăn, totalPrice = 683,000

### Bước 5: Xóa Dầu ăn
```
DELETE http://localhost:8080/supermartket/carts/items
{
    "customerId": "d4000004-0004-0004-0004-000000000001",
    "productId": "h8000008-0008-0008-0008-000000000002"
}
```
→ Giỏ hàng chỉ còn 5 Gạo, totalPrice = 625,000

### Bước 6: Xem giỏ hàng
```
GET http://localhost:8080/supermartket/carts/d4000004-0004-0004-0004-000000000001
```

### Bước 7: Xóa toàn bộ giỏ hàng
```
DELETE http://localhost:8080/supermartket/carts/d4000004-0004-0004-0004-000000000001
```
→ Giỏ hàng trống, totalPrice = 0

---

## ❌ Các Lỗi Thường Gặp

### 1. 401 Unauthorized
- **Nguyên nhân:** Chưa có token hoặc token hết hạn
- **Giải pháp:** Login lại để lấy token mới

### 2. 400 Bad Request - "Cart not found"
- **Nguyên nhân:** `customerId` không tồn tại hoặc chưa có giỏ hàng
- **Giải pháp:** Kiểm tra lại `customerId` hoặc tạo giỏ hàng bằng cách thêm sản phẩm

### 3. 400 Bad Request - "Cart item not found"
- **Nguyên nhân:** Sản phẩm không có trong giỏ hàng
- **Giải pháp:** Kiểm tra lại `productId` hoặc thêm sản phẩm vào giỏ hàng trước

### 4. 400 Bad Request - "Product quantity less than request quantity"
- **Nguyên nhân:** Số lượng yêu cầu vượt quá số lượng trong kho
- **Giải pháp:** Giảm `quantity` hoặc chọn sản phẩm khác

### 5. 400 Bad Request - Validation error
- **Nguyên nhân:** Thiếu field bắt buộc hoặc `quantity <= 0`
- **Giải pháp:** Kiểm tra lại request body

---

## 💡 So Sánh POST vs PUT

| Thao tác | Endpoint | Hành vi |
|----------|----------|---------|
| **Thêm/Cộng dồn** | `POST /carts` | Nếu sản phẩm đã có → cộng dồn số lượng |
| **Cập nhật** | `PUT /carts/items` | Thay thế số lượng (không cộng dồn) |

**Ví dụ:**
- Giỏ hàng có 2 Gạo
- `POST /carts` với quantity=3 → Giỏ hàng có 5 Gạo (2+3)
- `PUT /carts/items` với quantity=3 → Giỏ hàng có 3 Gạo (thay thế)

---

## 📦 Files JSON Mẫu

Đã tạo các file mẫu trong `postman_examples/`:
- `add_to_cart_request.json` - Thêm sản phẩm
- `update_cart_item_request.json` - Cập nhật số lượng
- `remove_cart_item_request.json` - Xóa sản phẩm
