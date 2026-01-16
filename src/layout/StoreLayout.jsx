import {
  Box,
} from "@mui/material";
import { NavLink, Outlet } from "react-router-dom";

export default function StoreLayout() {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
      <Outlet />
    </Box>
  );
}
