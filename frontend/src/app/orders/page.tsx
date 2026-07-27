"use client";

import Link from "next/link";

export default function OrdersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      <div className="bg-white rounded-lg shadow p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4">Track Order</h2>
        <p className="text-gray-600 mb-4">
          Already have an order? Track it here:
        </p>
        <Link
          href="/orders/track"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Track Your Order
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500 text-lg mb-4">Please login to view your order history</p>
        <Link
          href="/login"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
