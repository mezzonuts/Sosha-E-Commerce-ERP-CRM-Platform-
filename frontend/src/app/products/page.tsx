import ProductCard from "@/components/ProductCard";
import SearchAndFilter from "@/components/SearchAndFilter";
import { api } from "@/lib/api";
import { Product, Category } from "@/types";

async function getProducts(skip = 0, limit = 20, search = "", category_id?: number, min_price?: number, max_price?: number, sort_by?: string) {
  try {
    let url = `/api/products?skip=${skip}&limit=${limit}`;
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category_id) params.set("category_id", String(category_id));
    if (min_price !== undefined) params.set("min_price", String(min_price));
    if (max_price !== undefined) params.set("max_price", String(max_price));
    if (sort_by) params.set("sort_by", sort_by);

    const queryString = params.toString();
    if (queryString) {
      url += `&${queryString}`;
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
  searchParams: {
    search?: string;
    category_id?: string;
    min_price?: string;
    max_price?: string;
    sort_by?: string;
  };
}) {
  const products = await getProducts(
    0,
    20,
    searchParams.search || "",
    searchParams.category_id ? Number(searchParams.category_id) : undefined,
    searchParams.min_price ? Number(searchParams.min_price) : undefined,
    searchParams.max_price ? Number(searchParams.max_price) : undefined,
    searchParams.sort_by
  );
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Products</h1>
      <SearchAndFilter categories={categories} />
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
