import React from "react";
import Header from "../components/Header.jsx";
import MapComponent from "../components/Map.jsx";
import { Box } from "@mui/material";

const UserPage = () => {
  return (
    <Box>
      <Header />
      <MapComponent />
    </Box>
  );
};

export default UserPage;
