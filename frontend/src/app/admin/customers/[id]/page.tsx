"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/app/admin/layout";
import { api } from "@/lib/api";
import { Customer, Order } from "@/types";
import Link from "next/link";

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomer();
    fetchOrders();
  }, [params.id]);

  const fetchCustomer = async () => {
    try {
      const response = await api.get<{ data: Customer[] }>("/api/customers?skip=0&limit=100");
      const found = response.data?.find((c) => c.id === Number(params.id));
      setCustomer(found || null);
    } catch (error) {
      console.error("Failed to fetch customer:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get<{ data: Order[] }>("/api/orders?skip=0&limit=100");
      const customerOrders = response.data?.filter((o) => o.customer_id === Number(params.id)) || [];
      setOrders(customerOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Loading customer...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!customer) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Customer Not Found</h1>
          <Link href="/admin/customers" className="text-blue-600 hover:text-blue-800">
            ← Back to Customers
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/customers"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-gray-600">Customer Details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Customer ID</p>
                <p className="font-medium">#{customer.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{customer.phone || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{customer.address || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium">
                  {new Date(customer.created_at).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Order History</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.order_date).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full capitalize ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center text-sm"
                        >
                          <span>
                            {item.product?.name || `Product #${item.product_id}`} x{item.qty}
                          </span>
                          <span className="font-medium">
                            {formatPrice(item.price * item.qty)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2 mt-3 flex justify-between items-center">
                      <span className="font-semibold">Total</span>
                      <span className="text-blue-600 font-bold">
                        {formatPrice(order.total_amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
