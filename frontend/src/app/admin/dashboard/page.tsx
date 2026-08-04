import AdminLayout from "@/app/admin/layout";
import Link from "next/link";
import { api } from "@/lib/api";

async function getDashboardStats() {
  try {
    const [productsRes, ordersRes, customersRes, salesRes] = await Promise.all([
      api.get<{ total: number }>("/api/products?skip=0&limit=1"),
      api.get<{ total: number }>("/api/orders?skip=0&limit=1"),
      api.get<{ total: number }>("/api/customers?skip=0&limit=1"),
      api.get<{ period: string; total_revenue: number }>("/api/reporting/sales?period=month"),
    ]);

    return {
      totalProducts: productsRes.total || 0,
      totalOrders: ordersRes.total || 0,
      totalCustomers: customersRes.total || 0,
      monthlyRevenue: salesRes.total_revenue || 0,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalCustomers: 0,
      monthlyRevenue: 0,
    };
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(price);
};

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: "📦",
      color: "bg-blue-500",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: "📋",
      color: "bg-green-500",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: "👥",
      color: "bg-purple-500",
    },
    {
      title: "Monthly Revenue",
      value: formatPrice(stats.monthlyRevenue),
      icon: "💰",
      color: "bg-yellow-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to Sosha Admin Panel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-6 flex items-center space-x-4"
            >
              <div
                className={`${stat.color} text-white text-3xl w-16 h-16 rounded-lg flex items-center justify-center`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/products"
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold">Manage Products</h3>
              <p className="text-sm text-gray-600">Add, edit, or remove products</p>
            </Link>
            <Link
              href="/admin/orders"
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold">Manage Orders</h3>
              <p className="text-sm text-gray-600">Update order status and shipments</p>
            </Link>
            <Link
              href="/admin/reports"
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold">View Reports</h3>
              <p className="text-sm text-gray-600">Sales, products, and customer analytics</p>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
