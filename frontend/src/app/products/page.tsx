import ProductCard from "@/components/ProductCard";
import SearchAndFilter from "@/components/SearchAndFilter";
import { api } from "@/lib/api";
import { Product, Category } from "@/types";

async function getProducts(skip = 0, limit = 20, search = "", filters?: any) {
  try {
    let url = `/api/products?skip=${skip}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await api.get<{ data: Product[] }>(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const response = await api.get<Category[]>("/api/categories");
    return response;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const products = await getProducts(0, 20, searchParams.search || "");
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Products</h1>
      <SearchAndFilter
        onSearch={(query) => {
          console.log("Search:", query);
        }}
        onFilter={(filters) => {
          console.log("Filters:", filters);
        }}
        categories={categories}
      />
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
