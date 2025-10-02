import React, { useState } from "react";
import { Box } from "@mui/material";

import Header from "../../components/user/layout/Header";
import SidebarMenu from "../../components/user/layout/Sidebar"; // Sửa từ SidebarMenu thành Sidebar
import BusList from "../../components/user/bus/BusList";
import MapContainer from "../../components/user/map/MapContainer";
import MapLegend from "../../components/user/map/MapLegend";

import mockBusData from "../../data/mockBusData";

const MapPage = () => {
  const [buses] = useState(mockBusData);

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Header />
      <SidebarMenu />
      <Box component="main" sx={{ flexGrow: 1, display: "flex", mt: "60px" }}>
        <BusList buses={buses} />
        <Box sx={{ flexGrow: 1, position: "relative" }}>
          <MapContainer buses={buses} />
          <MapLegend />
        </Box>
      </Box>
    </Box>
  );
};

export default MapPage;