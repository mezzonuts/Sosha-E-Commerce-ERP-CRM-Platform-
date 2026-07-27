import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";
import { Product } from "@/types";

async function getProducts() {
  try {
    const response = await api.get<{ data: Product[] }>("/api/products?skip=0&limit=12");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Sosha
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your one-stop shop for quality products. Browse our catalog and enjoy a seamless shopping experience.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Featured Products
        </h2>
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No products available at the moment. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <div className="text-center p-6 bg-white rounded-lg shadow">
          <div className="text-3xl mb-4">🚚</div>
          <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
          <p className="text-gray-600">On orders over Rp 500.000</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow">
          <div className="text-3xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
          <p className="text-gray-600">100% secure payment</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow">
          <div className="text-3xl mb-4">💬</div>
          <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
          <p className="text-gray-600">Dedicated support anytime</p>
        </div>
      </div>
    </div>
  );
}
