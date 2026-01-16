import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  /* ================================
     Persist cart on every change
  ================================= */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  /* ================================
     Add item to cart
  ================================= */
  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const index = prev.findIndex((p) => p.id === product.id);

      if (index !== -1) {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          quantity: updated[index].quantity + quantity,
        };
        return updated;
      }

      return [...prev, { ...product, quantity }];
    });
  };

  /* ================================
     Remove item completely
  ================================= */
  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
  };

  /* ================================
     Update item quantity
     (auto-removes if quantity <= 0)
  ================================= */
  const updateQuantity = (productId, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((p) => p.id !== productId);
      }

      return prev.map((p) => (p.id === productId ? { ...p, quantity } : p));
    });
  };

  /* ================================
     Clear entire cart
  ================================= */
  const clearCart = () => {
    setItems([]);
  };

  /* ================================
     Cart helpers
  ================================= */
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ================================
   Hook
================================= */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};
