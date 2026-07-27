"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/app/admin/layout";
import { api } from "@/lib/api";
import { Order } from "@/types";

export default function AdminWhatsAppPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get<{ data: Order[] }>("/api/orders?skip=0&limit=100");
      setOrders(response.data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async (orderId: number, type: string) => {
    setSending(orderId);
    try {
      await api.post(`/api/whatsapp/send/${orderId}`, { type });
      setMessage("WhatsApp notification sent successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Failed to send notification:", error);
      setMessage("Failed to send notification");
    } finally {
      setSending(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">WhatsApp Integration</h1>
          <p className="text-gray-600 mt-1">Send notifications to customers</p>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-600">{message}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{order.customer_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full capitalize bg-blue-100 text-blue-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => sendNotification(order.id, "order_created")}
                        disabled={sending === order.id}
                        className="text-green-600 hover:text-green-800 mr-4 disabled:opacity-50"
                      >
                        Order Confirmation
                      </button>
                      <button
                        onClick={() => sendNotification(order.id, "payment")}
                        disabled={sending === order.id}
                        className="text-blue-600 hover:text-blue-800 mr-4 disabled:opacity-50"
                      >
                        Payment Update
                      </button>
                      <button
                        onClick={() => sendNotification(order.id, "shipment")}
                        disabled={sending === order.id}
                        className="text-purple-600 hover:text-purple-800 disabled:opacity-50"
                      >
                        Shipment Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
