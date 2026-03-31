import { Box } from "@mui/material";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Header from "../components/Header";
import Hero from "../components/Hero";
import Products from "../components/Products";
import Project from "../components/project";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <Box>
      <Hero></Hero>
      <Products></Products>
      <Project></Project>
    </Box>
  );
}
