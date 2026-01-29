# SuperMart Management Pro - Frontend

ReactJS admin dashboard cho hệ thống quản lý siêu thị.

## 🚀 Setup

### 1. Cài đặt dependencies

```bash
cd frontend
npm install
```

### 2. Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

### 3. Build production

```bash
npm run build
```

## 📁 Cấu trúc Project

```
frontend/
├── src/
│   ├── components/          # Các component tái sử dụng
│   │   ├── Layout.jsx       # Layout chính (Sidebar + TopBar)
│   │   ├── Sidebar.jsx      # Sidebar navigation
│   │   ├── TopBar.jsx       # Top bar với search
│   │   └── KpiCard.jsx      # Card hiển thị KPI
│   ├── pages/               # Các trang chính
│   │   ├── DashboardHome.jsx
│   │   ├── Products.jsx
│   │   ├── Customers.jsx
│   │   └── ...
│   ├── services/            # API services
│   │   ├── api.js          # Axios instance
│   │   ├── authService.js  # Authentication
│   │   ├── userService.js  # User API
│   │   └── cartService.js  # Cart API
│   ├── config/
│   │   └── api.js          # API endpoints config
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── package.json
└── vite.config.js
```

## 🔌 Kết nối với Backend

Backend API chạy tại: `http://localhost:8080/supermartket`

### API Endpoints đã cấu hình:

- **Auth:** `/auth/token`
- **Users:** `/users`, `/users/{id}`, `/users/search`
- **Cart:** `/carts`, `/carts/{customerId}`, `/carts/items`

### Authentication:

Token được lưu trong `localStorage` và tự động thêm vào header của mọi request.

## 🎨 Styling

Sử dụng **Tailwind CSS** cho styling.

## 📦 Dependencies chính

- **React 18** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **date-fns** - Date formatting
- **Recharts** - Charts (chưa tích hợp, có thể thêm sau)

## 🔄 Next Steps

1. ✅ Layout và Navigation
2. ✅ Dashboard Home với KPI cards
3. ✅ API services setup
4. ⏳ Tích hợp charts (Recharts)
5. ⏳ Các trang quản lý (Products, Customers, Orders...)
6. ⏳ Form components
7. ⏳ Authentication flow

## 📝 Notes

- Token được lưu trong localStorage
- API proxy được cấu hình trong `vite.config.js`
- Responsive design với Tailwind CSS
