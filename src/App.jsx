import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

const App = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      {/* Outlet sẽ render các trang con (Dashboard, Map, Bus, ...) */}
      <Outlet />
    </Box>
  );
};

export default App;
