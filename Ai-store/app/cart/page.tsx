'use client'

import { useCartStore } from '@/store/cartStore'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore()
  const router = useRouter()
  const total = getTotal()

  const handleCheckout = () => {
    alert('Checkout functionality would be implemented here!')
    // In a real app, this would redirect to checkout page
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <ShoppingBag className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Start shopping to add items to your cart!</p>
          <Link
            href="/"
            className="inline-block bg-primary-600 dark:bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-all hover:scale-105 shadow-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Link
        href="/"
        className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-6 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Continue Shopping
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 flex flex-col sm:flex-row gap-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="relative h-32 w-32 sm:h-24 sm:w-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded-lg"
                  sizes="128px"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {item.name}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 font-bold text-lg mb-4">
                  ${item.price.toFixed(2)}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Minus className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                    </button>
                    <span className="w-12 text-center font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Plus className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 sticky top-24 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className="font-semibold">{total >= 50 ? 'Free' : '$9.99'}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax</span>
                <span className="font-semibold">${(total * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span className="gradient-text">${(total + (total >= 50 ? 0 : 9.99) + total * 0.1).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {total < 50 && (
              <p className="text-sm text-primary-600 dark:text-primary-400 mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                Add ${(50 - total).toFixed(2)} more for free shipping!
              </p>
            )}

            <button
              onClick={handleCheckout}
              className="w-full bg-primary-600 dark:bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 dark:hover:bg-primary-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary-500/50 mb-4"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={clearCart}
              className="w-full text-gray-600 dark:text-gray-400 py-2 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

