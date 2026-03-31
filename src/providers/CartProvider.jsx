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
     Generate unique cart item ID based on product ID
  ================================= */
  const generateCartItemId = (productId) => {
    return `${productId}`;
  };

  /* ================================
     Add item to cart
  ================================= */
  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      // Generate unique ID for the product
      const cartItemId = generateCartItemId(product._id || product.id);

      // Find if same product already exists
      const existingItemIndex = prev.findIndex(
        (item) => item.cartItemId === cartItemId,
      );

      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const updated = [...prev];
        updated[existingItemIndex] = {
          ...updated[existingItemIndex],
          quantity: updated[existingItemIndex].quantity + quantity,
        };
        return updated;
      }

      // Add new item
      return [
        ...prev,
        {
          ...product,
          quantity,
          cartItemId, // Unique identifier for this product
        },
      ];
    });

    // Facebook Pixel tracking
    if (window.fbq) {
      const effectivePrice = product.discountPrice && product.discountPrice < product.price 
        ? product.discountPrice 
        : product.price;
      
      window.fbq("track", "AddToCart", {
        content_ids: [product._id || product.id],
        content_type: "product",
        value: effectivePrice * quantity,
        currency: "DZD",
      });
    }
  };

  /* ================================
     Remove item completely
  ================================= */
  const removeFromCart = (productId) => {
    setItems((prev) => {
      const cartItemId = generateCartItemId(productId);
      return prev.filter((item) => item.cartItemId !== cartItemId);
    });
  };

  /* ================================
     Update item quantity
     (auto-removes if quantity <= 0)
  ================================= */
  const updateQuantity = (productId, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) {
        const cartItemId = generateCartItemId(productId);
        return prev.filter((item) => item.cartItemId !== cartItemId);
      }

      return prev.map((item) => {
        const itemId = generateCartItemId(item._id || item.id);
        const targetId = generateCartItemId(productId);

        if (itemId === targetId) {
          return { ...item, quantity };
        }
        return item;
      });
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

  const cartTotal = items.reduce((sum, item) => {
    // Use discount price if available and valid
    const price = item.discountPrice && item.discountPrice > 0 && item.discountPrice < item.price
      ? item.discountPrice
      : item.price;
    return sum + price * item.quantity;
  }, 0);

  /* ================================
     Check if a product is in cart
  ================================= */
  const isInCart = (productId) => {
    const cartItemId = generateCartItemId(productId);
    return items.some((item) => item.cartItemId === cartItemId);
  };

  /* ================================
     Get quantity of a product
  ================================= */
  const getItemQuantity = (productId) => {
    const cartItemId = generateCartItemId(productId);
    const item = items.find((item) => item.cartItemId === cartItemId);
    return item ? item.quantity : 0;
  };

  /* ================================
     Get total price for a specific product (with discount applied)
  ================================= */
  const getProductTotalPrice = (productId) => {
    const cartItemId = generateCartItemId(productId);
    const item = items.find((item) => item.cartItemId === cartItemId);
    if (!item) return 0;
    
    const price = item.discountPrice && item.discountPrice > 0 && item.discountPrice < item.price
      ? item.discountPrice
      : item.price;
    return price * item.quantity;
  };

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
        isInCart,
        getItemQuantity,
        getProductTotalPrice,
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