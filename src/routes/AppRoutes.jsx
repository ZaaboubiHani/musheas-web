import { Routes, Route } from "react-router-dom";
import StoreLayout from "../layout/StoreLayout";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Checkout from "../pages/Checkout";
import Store from "../pages/Store";
import B2b from "../pages/B2b";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<StoreLayout/>}>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/store" element={<Store />} />
        <Route path="/b2b" element={<B2b />} />
      </Route>
    </Routes>
  );
}
