import {
  Box,

} from "@mui/material";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Header from "../components/Header";
import Hero from "../components/Hero";
import Products from "../components/Products";
import Project from "../components/project";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
 
  return (
    <Box>
     <Header></Header>
     <Hero></Hero>
     <Products></Products>
     <Project></Project>
     <Contact></Contact>
     <Footer></Footer>
    </Box>
  );
}
