"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <div key={item.id} className="p-6 flex items-center gap-6">
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-400 text-2xl">📦</span>
                )}
              </div>
              <div className="flex-1">
                <Link href={`/products/${item.id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                  {item.name}
                </Link>
                <p className="text-gray-500 text-sm mt-1">SKU: {item.sku}</p>
                <p className="text-blue-600 font-semibold mt-2">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x border-gray-300">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 p-6 flex justify-between items-center">
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Clear Cart
          </button>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</p>
            <p className="text-2xl font-bold text-gray-900">{formatPrice(totalPrice)}</p>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200">
          <Link
            href="/checkout"
            className="block w-full bg-blue-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
