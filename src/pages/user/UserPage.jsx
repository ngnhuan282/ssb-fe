import React from "react";
import Header from "../../components/user/layout/Header";
import MapComponent from "./MapPage";
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
