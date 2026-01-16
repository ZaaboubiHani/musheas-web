import { Routes, Route } from "react-router-dom";
import StoreLayout from "../layout/StoreLayout";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";


export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<StoreLayout/>}>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetails />} />

      </Route>
    </Routes>
  );
}
