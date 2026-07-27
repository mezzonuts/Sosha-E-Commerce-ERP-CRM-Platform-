"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/app/admin/layout";
import { api } from "@/lib/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(price);
};

export default function AdminReportsPage() {
  const [salesReport, setSalesReport] = useState<any>(null);
  const [productReport, setProductReport] = useState<any>(null);
  const [customerReport, setCustomerReport] = useState<any>(null);
  const [orderReport, setOrderReport] = useState<any>(null);
  const [paymentReport, setPaymentReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [sales, products, customers, orders, payments] = await Promise.all([
        api.get<{ period: string; total_revenue: number; total_orders: number; avg_order_value: number }>("/api/reporting/sales?period=month"),
        api.get<{ total_products: number; active_products: number; low_stock_products: number }>("/api/reporting/products"),
        api.get<{ total_customers: number; new_customers_last_30_days: number }>("/api/reporting/customers"),
        api.get<{ total_orders: number; pending: number; processing: number; shipped: number; delivered: number; cancelled: number }>("/api/reporting/orders"),
        api.get<{ total_payments: number; paid: number; pending: number; failed: number }>("/api/reporting/payments"),
      ]);

      setSalesReport(sales);
      setProductReport(products);
      setCustomerReport(customers);
      setOrderReport(orders);
      setPaymentReport(payments);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Loading reports...</p>
        </div>
      </AdminLayout>
    );
  }

  const orderStatusData = {
    labels: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    datasets: [
      {
        label: "Orders",
        data: [
          orderReport?.pending || 0,
          orderReport?.processing || 0,
          orderReport?.shipped || 0,
          orderReport?.delivered || 0,
          orderReport?.cancelled || 0,
        ],
        backgroundColor: [
          "rgba(251, 191, 36, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(147, 51, 234, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgb(251, 191, 36)",
          "rgb(59, 130, 246)",
          "rgb(147, 51, 234)",
          "rgb(34, 197, 94)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const paymentStatusData = {
    labels: ["Paid", "Pending", "Failed"],
    datasets: [
      {
        label: "Payments",
        data: [
          paymentReport?.paid || 0,
          paymentReport?.pending || 0,
          paymentReport?.failed || 0,
        ],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgb(34, 197, 94)",
          "rgb(251, 191, 36)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const productStatusData = {
    labels: ["Active", "Low Stock"],
    datasets: [
      {
        label: "Products",
        data: [productReport?.active_products || 0, productReport?.low_stock_products || 0],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgb(34, 197, 94)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Business analytics and insights</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
            {salesReport && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Period</span>
                  <span className="font-medium capitalize">{salesReport.period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-medium text-green-600">
                    {formatPrice(salesReport.total_revenue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-medium">{salesReport.total_orders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Order Value</span>
                  <span className="font-medium">{formatPrice(salesReport.avg_order_value)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Product Statistics</h2>
            {productReport && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Products</span>
                  <span className="font-medium">{productReport.total_products}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Products</span>
                  <span className="font-medium text-green-600">
                    {productReport.active_products}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Low Stock Products</span>
                  <span className="font-medium text-red-600">
                    {productReport.low_stock_products}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Customer Statistics</h2>
            {customerReport && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Customers</span>
                  <span className="font-medium">{customerReport.total_customers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">New Customers (30 days)</span>
                  <span className="font-medium text-blue-600">
                    {customerReport.new_customers_last_30_days}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Order Status</h2>
            {orderReport && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-medium">{orderReport.total_orders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-medium text-yellow-600">{orderReport.pending}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing</span>
                  <span className="font-medium text-blue-600">{orderReport.processing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipped</span>
                  <span className="font-medium text-purple-600">{orderReport.shipped}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivered</span>
                  <span className="font-medium text-green-600">{orderReport.delivered}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cancelled</span>
                  <span className="font-medium text-red-600">{orderReport.cancelled}</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Payment Statistics</h2>
            {paymentReport && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{paymentReport.total_payments}</p>
                  <p className="text-sm text-gray-600">Total Payments</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{paymentReport.paid}</p>
                  <p className="text-sm text-gray-600">Paid</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{paymentReport.pending}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{paymentReport.failed}</p>
                  <p className="text-sm text-gray-600">Failed</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Order Status Chart</h2>
            <Bar data={orderStatusData} options={chartOptions} />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Status Chart</h2>
            <Pie data={paymentStatusData} options={chartOptions} />
          </div>

          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Product Status Chart</h2>
            <div className="max-w-md mx-auto">
              <Doughnut data={productStatusData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
