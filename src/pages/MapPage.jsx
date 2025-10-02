import React, { useState } from "react";
import { Box } from "@mui/material";
import Header from "../components/layout/Header";
import SidebarMenu from "../components/layout/Sidebar";
import BusList from "../components/bus/BusList";
import MapContainer from "../components/map/MapContainer";
import MapLegend from "../components/map/MapLegend";
import mockBusData from "../data/mockBusData";

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
