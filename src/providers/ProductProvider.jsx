import React, { createContext, useContext, useEffect, useState } from "react";
import Api from "../api/api.source";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const axios = Api.instance.getAxios();

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [product, setProduct] = useState(null); // for single product
  const [productLoading, setProductLoading] = useState(false);
  const [pagination, setPagination] = useState(null); // store pagination info
  const [randomProducts, setRandomProducts] = useState([]); // for random products
  const [randomProductsLoading, setRandomProductsLoading] = useState(false);

  /* ---------------- FETCH ALL ---------------- */
  const fetchProducts = async ({
    page = 1,
    limit = 10,
    productType, // <-- new: optional filter
  } = {}) => {
    setProductsLoading(true);
    try {
      const params = {
        page,
        limit,
      };

      // Only add productType if provided
      if (productType) {
        params.productType = productType;
      }

      const { data } = await axios.get("/products", { params });

      setProducts(data.data);
      setPagination(data.pagination); // store pagination in state
      return data.pagination;
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
      return data.data;
    } finally {
      setProductLoading(false);
    }
  };

  /* ---------------- FETCH RANDOM PRODUCTS ---------------- */
  const fetchRandomProducts = async () => {
    setRandomProductsLoading(true);
    try {
      const { data } = await axios.get("/products/random");
      setRandomProducts(data.data);
      return data.data;
    } catch (error) {
      console.error("Error fetching random products:", error);
      setRandomProducts([]);
      return [];
    } finally {
      setRandomProductsLoading(false);
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
        pagination, // expose pagination
        randomProducts,
        randomProductsLoading,
        fetchRandomProducts,
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
