"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/app/admin/layout";
import { api } from "@/lib/api";
import { Order, OrderItem, Shipment } from "@/types";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [shipmentForm, setShipmentForm] = useState({
    courier: "",
    tracking_number: "",
    status: "pending",
  });
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchOrder();
    fetchShipments();
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      const data = await api.get<Order>(`/api/orders/${params.id}`);
      setOrder(data);
    } catch (error) {
        console.error("Failed to fetch order:", error);
    } finally {
        setLoading(false);
    }
  };

  const fetchShipments = async () => {
    try {
      const response = await api.get<{ data: Shipment[] }>(`/api/shipments/order/${params.id}?skip=0&limit=100`);
      setShipments(response.data || []);
    } catch (error) {
      console.error("Failed to fetch shipments:", error);
    }
  };

  const updateOrderStatus = async (status: string) => {
    if (!order) return;
    try {
      await api.put(`/api/orders/${order.id}/status`, { status });
      setOrder({ ...order, status });
      showToast("Order status updated successfully", "success");
    } catch (error) {
      console.error("Failed to update order status:", error);
      showToast("Failed to update order status", "error");
    }
  };

  const createShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setSaving(true);
    try {
      await api.post("/api/shipments", {
        order_id: order.id,
        courier: shipmentForm.courier,
        tracking_number: shipmentForm.tracking_number,
        status: shipmentForm.status,
      });
      setShowShipmentModal(false);
      setShipmentForm({ courier: "", tracking_number: "", status: "pending" });
      fetchShipments();
      showToast("Shipment created successfully", "success");
    } catch (error) {
      console.error("Failed to create shipment:", error);
      showToast("Failed to create shipment", "error");
    } finally {
      setSaving(false);
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
          <p className="text-gray-500">Loading order...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <Link href="/admin/orders" className="text-blue-600 hover:text-blue-800">
            ← Back to Orders
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/orders"
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
              <p className="text-gray-600">Order Details</p>
            </div>
          </div>
          <select
            value={order.status}
            onChange={(e) => updateOrderStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item: OrderItem) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {item.product?.name || `Product #${item.product_id}`}
                      </p>
                      <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                    </div>
                    <p className="font-semibold text-blue-600">
                      {formatPrice(item.price * item.qty)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Shipment Tracking</h2>
                <button
                  onClick={() => setShowShipmentModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Shipment
                </button>
              </div>
              {shipments.length === 0 ? (
                <p className="text-gray-500">No shipments yet</p>
              ) : (
                <div className="space-y-4">
                  {shipments.map((shipment) => (
                    <div
                      key={shipment.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold">Courier: {shipment.courier || "-"}</p>
                          <p className="text-sm text-gray-600">
                            Tracking: {shipment.tracking_number || "-"}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full capitalize ${
                            statusColors[shipment.status] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {shipment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Order Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-medium">#{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer ID</p>
                  <p className="font-medium">#{order.customer_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium">
                    {new Date(order.order_date).toLocaleString("id-ID")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full capitalize ${
                      statusColors[order.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showShipmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add Shipment</h2>
              <form onSubmit={createShipment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Courier
                  </label>
                  <input
                    type="text"
                    value={shipmentForm.courier}
                    onChange={(e) =>
                      setShipmentForm({ ...shipmentForm, courier: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={shipmentForm.tracking_number}
                    onChange={(e) =>
                      setShipmentForm({ ...shipmentForm, tracking_number: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={shipmentForm.status}
                    onChange={(e) =>
                      setShipmentForm({ ...shipmentForm, status: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowShipmentModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
