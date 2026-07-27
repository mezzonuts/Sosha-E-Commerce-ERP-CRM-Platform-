"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/app/admin/layout";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

export default function AdminMarketplacePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [syncResults, setSyncResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<number | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchMarketplaceProducts();
  }, []);

  const fetchMarketplaceProducts = async () => {
    try {
      const response = await api.get<{ data: any[] }>("/api/marketplace/products?skip=0&limit=100");
      setProducts(response.data || []);
    } catch (error) {
      console.error("Failed to fetch marketplace products:", error);
    } finally {
      setLoading(false);
    }
  };

  const syncProduct = async (productId: number) => {
    setSyncing(productId);
    try {
      const result = await api.post(`/api/marketplace/sync/${productId}`);
      setSyncResults((prev) => [...prev, { product_id: productId, result }]);
      showToast("Product synced to marketplaces", "success");
    } catch (error) {
      console.error("Failed to sync product:", error);
      showToast("Failed to sync product", "error");
    } finally {
      setSyncing(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace Integration</h1>
          <p className="text-gray-600 mt-1">Sync products to external marketplaces</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading marketplace products...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Marketplace
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
                {products.map((item) => (
                  <tr key={`${item.product_id}-${item.marketplace}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.product_name || `Product #${item.product_id}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.product_sku || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {item.marketplace}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.sync_status === "synced"
                            ? "bg-green-100 text-green-800"
                            : item.sync_status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.sync_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => syncProduct(item.product_id)}
                        disabled={syncing === item.product_id}
                        className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      >
                        {syncing === item.product_id ? "Syncing..." : "Sync"}
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
