import React, { createContext, useContext, useEffect, useState } from "react";
import Api from "../api/api.source";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const axios = Api.instance.getAxios();

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [product, setProduct] = useState(null); // for single product
  const [productLoading, setProductLoading] = useState(false);

  /* ---------------- FETCH ALL ---------------- */
  const fetchProducts = async ({
    search = "",
    category = "",
    priceRange = [0, 1000],
    sortBy = "",
    page = 1, // <-- new
    limit = 100, // <-- new
    lang = "en",
  } = {}) => {
    setProductsLoading(true);
    try {
      const { data } = await axios.get("/products", {
        params: {
          search,
          category,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          lang,
          sortBy,
          page, // send page to backend
          limit, // send limit to backend
        },
      });

      setProducts(data.data);
      return data.pagination; // return pagination info if needed
    } finally {
      setProductsLoading(false);
    }
  };

  /* ---------------- FETCH SINGLE ---------------- */
  const fetchProductById = async (id) => {
    setProductLoading(true);
    try {
      const { data } = await axios.get(`/products/${id}`);
      setProduct(data.data);
      return data.data; // optional: return the fetched product
    } finally {
      setProductLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        productsLoading,
        fetchProducts,
        product,
        productLoading,
        fetchProductById,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used inside ProductProvider");
  }
  return context;
};
