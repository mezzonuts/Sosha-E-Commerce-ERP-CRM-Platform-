"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product } from "@/types";
import { useAuth } from "@/context/AuthContext";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_URL = "http://localhost:8000";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { token, isAuthenticated } = useAuth();

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  const fetchCart = async () => {
    if (!isAuthenticated || !token) return;
    try {
      const response = await fetch(`${API_URL}/api/cart`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const cart = await response.json();
        const cartItems = cart.items.map((item: any) => ({
          ...item.product,
          quantity: item.qty,
        }));
        setItems(cartItems);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setItems([]);
    }
  }, [isAuthenticated, token]);

  const addToCart = async (product: Product) => {
    if (!isAuthenticated || !token) {
      setItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/cart/items`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ product_id: product.id, qty: 1 }),
      });
      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    if (!isAuthenticated || !token) {
      setItems((prev) => prev.filter((item) => item.id !== productId));
      return;
    }

    setLoading(true);
    try {
      const cartResponse = await fetch(`${API_URL}/api/cart`, {
        headers: getAuthHeaders(),
      });
      if (cartResponse.ok) {
        const cart = await cartResponse.json();
        const cartItem = cart.items.find((item: any) => item.product_id === productId);
        if (cartItem) {
          await fetch(`${API_URL}/api/cart/items/${cartItem.id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
          });
          await fetchCart();
        }
      }
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (!isAuthenticated || !token) {
      setItems((prev) =>
        prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
      );
      return;
    }

    setLoading(true);
    try {
      const cartResponse = await fetch(`${API_URL}/api/cart`, {
        headers: getAuthHeaders(),
      });
      if (cartResponse.ok) {
        const cart = await cartResponse.json();
        const cartItem = cart.items.find((item: any) => item.product_id === productId);
        if (cartItem) {
          await fetch(`${API_URL}/api/cart/items/${cartItem.id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({ qty: quantity }),
          });
          await fetchCart();
        }
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated || !token) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      await fetch(`${API_URL}/api/cart`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      setItems([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

