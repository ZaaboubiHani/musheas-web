import { Box } from "@mui/material";
import { NavLink, Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Contact from "../components/Contact";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function StoreLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
      <Header />

      <Outlet />
      <Contact />
      <Footer />
    </Box>
  );
}
