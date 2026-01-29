export const API_BASE_URL = 'http://localhost:8080/supermartket'

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/token',
    INTROSPECT: '/auth/instrospect',
  },
  // Users
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    SEARCH: '/users/search',
  },
  // Products
  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products',
    GET: (id) => `/products/${id}`,
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
  },
  // Customers
  CUSTOMERS: {
    LIST: '/customers',
    GET: (id) => `/customers/${id}`,
  },
  // Cart
  CART: {
    ADD: '/carts',
    GET: (customerId) => `/carts/${customerId}`,
    UPDATE_ITEM: '/carts/items',
    REMOVE_ITEM: '/carts/items',
    CLEAR: (customerId) => `/carts/${customerId}`,
  },
  // Orders
  ORDERS: {
    LIST: '/orders',
    GET: (id) => `/orders/${id}`,
    CREATE: '/orders',
  },
  // Suppliers
  SUPPLIERS: {
    LIST: '/suppliers',
    CREATE: '/suppliers',
    GET: (id) => `/suppliers/${id}`,
    UPDATE: (id) => `/suppliers/${id}`,
    DELETE: (id) => `/suppliers/${id}`,
    SEARCH: '/suppliers/search',
  },
  // Staff
  STAFF: {
    LIST: '/staff',
    GET: (id) => `/staff/${id}`,
    SEARCH: '/staff/search',
  },
  // Import Slips
  IMPORT_SLIPS: {
    LIST: '/import-slips',
    CREATE: '/import-slips',
    GET: (id) => `/import-slips/${id}`,
  },
  // Dashboard
  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
  },
}
