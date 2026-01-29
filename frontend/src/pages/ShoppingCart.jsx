import { useState, useEffect } from 'react'
import { ShoppingBag, Plus, Minus, Trash2, X } from 'lucide-react'
import { cartService } from '../services/cartService'

// Mock data - sẽ thay bằng API thật sau
const mockCarts = [
  {
    id: 'CART001',
    customerId: 'd4000004-0004-0004-0004-000000000001',
    customerName: 'Alice Thompson',
    totalPrice: 15.27,
    cartDetails: [
      {
        id: 'CD001',
        product: {
          id: 'h8000008-0008-0008-0008-000000000003',
          name: 'Fresh Milk',
          salePrice: 2.99,
          unit: '1L',
        },
        quantity: 2,
        subtotal: 5.98,
      },
      {
        id: 'CD002',
        product: {
          id: 'h8000008-0008-0008-0008-000000000007',
          name: 'Chocolate Bar',
          salePrice: 1.29,
          unit: 'bar',
        },
        quantity: 5,
        subtotal: 6.45,
      },
      {
        id: 'CD003',
        product: {
          id: 'h8000008-0008-0008-0008-000000000008',
          name: 'Greek Yogurt',
          salePrice: 3.99,
          unit: 'cup',
        },
        quantity: 1,
        subtotal: 3.99,
      },
    ],
  },
  {
    id: 'CART002',
    customerId: 'd4000004-0004-0004-0004-000000000003',
    customerName: 'Carol White',
    totalPrice: 12.77,
    cartDetails: [
      {
        id: 'CD004',
        product: {
          id: 'h8000008-0008-0008-0008-000000000002',
          name: 'Whole Wheat Bread',
          salePrice: 1.99,
          unit: 'loaf',
        },
        quantity: 3,
        subtotal: 5.97,
      },
      {
        id: 'CD005',
        product: {
          id: 'h8000008-0008-0008-0008-000000000005',
          name: 'Apple Juice',
          salePrice: 3.29,
          unit: '1L',
        },
        quantity: 2,
        subtotal: 6.58,
      },
    ],
  },
]

export default function ShoppingCart() {
  const [carts, setCarts] = useState(mockCarts)
  const [loading, setLoading] = useState(false)

  // TODO: Fetch carts from API
  // useEffect(() => {
  //   fetchCarts()
  // }, [])

  const handleUpdateQuantity = async (cartId, productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartId, productId)
      return
    }

    try {
      const cart = carts.find((c) => c.id === cartId)
      if (!cart) return

      // TODO: Call API
      // await cartService.updateCartItem(cart.customerId, productId, newQuantity)

      // Update local state
      setCarts((prevCarts) =>
        prevCarts.map((cart) => {
          if (cart.id === cartId) {
            const updatedDetails = cart.cartDetails.map((detail) => {
              if (detail.product.id === productId) {
                return {
                  ...detail,
                  quantity: newQuantity,
                  subtotal: detail.product.salePrice * newQuantity,
                }
              }
              return detail
            })
            const totalPrice = updatedDetails.reduce(
              (sum, detail) => sum + detail.subtotal,
              0
            )
            return {
              ...cart,
              cartDetails: updatedDetails,
              totalPrice,
            }
          }
          return cart
        })
      )
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const handleRemoveItem = async (cartId, productId) => {
    try {
      const cart = carts.find((c) => c.id === cartId)
      if (!cart) return

      // TODO: Call API
      // await cartService.removeCartItem(cart.customerId, productId)

      // Update local state
      setCarts((prevCarts) =>
        prevCarts.map((cart) => {
          if (cart.id === cartId) {
            const updatedDetails = cart.cartDetails.filter(
              (detail) => detail.product.id !== productId
            )
            const totalPrice = updatedDetails.reduce(
              (sum, detail) => sum + detail.subtotal,
              0
            )
            return {
              ...cart,
              cartDetails: updatedDetails,
              totalPrice,
            }
          }
          return cart
        })
      )
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const handleClearCart = async (cartId) => {
    if (!confirm('Are you sure you want to clear this cart?')) return

    try {
      const cart = carts.find((c) => c.id === cartId)
      if (!cart) return

      // TODO: Call API
      // await cartService.clearCart(cart.customerId)

      // Update local state
      setCarts((prevCarts) =>
        prevCarts.map((cart) => {
          if (cart.id === cartId) {
            return {
              ...cart,
              cartDetails: [],
              totalPrice: 0,
            }
          }
          return cart
        })
      )
    } catch (error) {
      console.error('Error clearing cart:', error)
    }
  }

  const handleCheckout = (cartId) => {
    const cart = carts.find((c) => c.id === cartId)
    if (!cart || cart.cartDetails.length === 0) {
      alert('Cart is empty')
      return
    }
    // TODO: Navigate to checkout page or create order
    alert(`Checkout for ${cart.customerName}'s cart`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
              Cart Management
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shopping Carts
          </h1>
          <p className="text-gray-600 text-sm">
            Manage customer shopping carts
          </p>
        </div>
      </div>

      {/* Cart Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {carts.map((cart) => (
          <div
            key={cart.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            {/* Cart Header */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-lg">{cart.customerName}</div>
                <div className="text-sm opacity-90">Cart ID: {cart.id}</div>
              </div>
              <ShoppingBag className="w-6 h-6 opacity-80" />
            </div>

            {/* Cart Items */}
            <div className="p-6">
              {cart.cartDetails.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Cart is empty
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {cart.cartDetails.map((detail) => (
                    <div
                      key={detail.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {detail.product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {detail.product.unit && `${detail.product.unit}, `}
                          ${detail.product.salePrice.toFixed(2)} each
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                cart.id,
                                detail.product.id,
                                detail.quantity - 1
                              )
                            }
                            className="p-1.5 hover:bg-gray-100 rounded-l-lg transition-colors"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium text-gray-900 min-w-[2rem] text-center">
                            {detail.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                cart.id,
                                detail.product.id,
                                detail.quantity + 1
                              )
                            }
                            className="p-1.5 hover:bg-gray-100 rounded-r-lg transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>

                        <div className="text-right min-w-[80px]">
                          <div className="font-semibold text-gray-900">
                            ${detail.subtotal.toFixed(2)}
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            handleRemoveItem(cart.id, detail.product.id)
                          }
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Cart Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${cart.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleClearCart(cart.id)}
                  disabled={cart.cartDetails.length === 0}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Clear Cart
                </button>
                <button
                  onClick={() => handleCheckout(cart.id)}
                  disabled={cart.cartDetails.length === 0}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-shadow"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {carts.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Shopping Carts
          </h3>
          <p className="text-gray-500">
            There are no active shopping carts at the moment.
          </p>
        </div>
      )}
    </div>
  )
}
