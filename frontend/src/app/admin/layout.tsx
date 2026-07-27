import Link from "next/link";
import { ReactNode } from "react";
import { ToastProvider } from "@/context/ToastContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-100">
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white">
          <div className="p-4 border-b border-gray-800">
            <Link href="/" className="text-xl font-bold">
              Sosha Admin
            </Link>
          </div>
          <nav className="p-4 space-y-2">
            <Link
              href="/admin/dashboard"
              className="block px-4 py-2 rounded hover:bg-gray-800"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="block px-4 py-2 rounded hover:bg-gray-800"
            >
              Products
            </Link>
            <Link
              href="/admin/orders"
              className="block px-4 py-2 rounded hover:bg-gray-800"
            >
              Orders
            </Link>
            <Link
              href="/admin/customers"
              className="block px-4 py-2 rounded hover:bg-gray-800"
            >
              Customers
            </Link>
            <Link
              href="/admin/reports"
              className="block px-4 py-2 rounded hover:bg-gray-800"
            >
              Reports
            </Link>
            <Link
              href="/admin/marketplace"
              className="block px-4 py-2 rounded hover:bg-gray-800"
            >
              Marketplace
            </Link>
            <Link
              href="/admin/whatsapp"
              className="block px-4 py-2 rounded hover:bg-gray-800"
            >
              WhatsApp
            </Link>
            <Link
              href="/"
              className="block px-4 py-2 rounded hover:bg-gray-800 text-gray-400"
            >
              Back to Store
            </Link>
          </nav>
        </aside>
        <main className="ml-64 p-8">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
