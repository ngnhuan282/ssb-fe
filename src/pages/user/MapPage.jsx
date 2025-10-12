import React, { useState } from "react";
import { Box } from "@mui/material";

import BusList from "../../components/user/bus/BusList";
import MapContainer from "../../components/user/map/MapContainer";
import MapLegend from "../../components/user/map/MapLegend";

import mockBusData from "../../data/mockBusData";

const MapPage = () => {
  const [buses] = useState(mockBusData);

  return (
    <Box 
      sx={{ 
        display: "flex",
        height: "calc(100vh - 70px - 48px)", 
        width: "100%",
        gap: 2,
      }}
    >
      <BusList buses={buses} />
      <Box 
        sx={{ 
          flexGrow: 1, 
          position: "relative", 
          borderRadius: 3, 
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <MapContainer buses={buses} />
        <MapLegend />
      </Box>
    </Box>
  );
};

export default MapPage;