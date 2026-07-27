"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Sosha
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link
              href="/products"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Products
            </Link>
            <Link
              href="/cart"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium relative"
            >
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              href="/orders"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Orders
            </Link>
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
