// src/pages/user/MapPage.jsx
import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import BusList from "../../components/user/bus/BusList";
import MapContainer from "../../components/user/map/MapContainer";
import MapLegend from "../../components/user/map/MapLegend";
import { useSocket } from "../../hooks/useSocket";
import mockBusData from "../../data/mockBusData";
import busSimulationService from "../../services/busSimulationService";
import { PlayArrow, Stop } from "@mui/icons-material";

const MapPage = () => {
  const socket = useSocket();
  const MOCK_CHILD_BUS_ID = "01";

  const parentBus = mockBusData.find((bus) => bus.id === MOCK_CHILD_BUS_ID);
  const initialBuses = parentBus ? [parentBus] : [];

  const [buses, setBuses] = useState(initialBuses);
  const [isSimulating, setIsSimulating] = useState(false);

  const busesLoading = false;
  const busesError = null;

  // Xử lý simulation
  const handleStartSimulation = () => {
    if (!parentBus || !parentBus.route?.stops) {
      console.error("No bus or route data");
      return;
    }

    setIsSimulating(true);

    // Bắt đầu simulation
    busSimulationService.startSimulation(
      parentBus.id,
      parentBus.route.stops,
      (data) => {
        // Callback được gọi mỗi giây để cập nhật vị trí
        setBuses((prevBuses) =>
          prevBuses.map((bus) =>
            bus.id === data.busId
              ? {
                  ...bus,
                  position: data.position,
                  latitude: data.position.lat,
                  longitude: data.position.lng,
                  speed: data.speed, // ✨ Thêm tốc độ
                  route: {
                    ...bus.route,
                    stops: data.stops,
                  },
                  status: "running",
                }
              : bus
          )
        );

        // Nếu có socket, emit vị trí mới
        if (socket) {
          socket.emit("updateLocation", {
            busId: data.busId,
            latitude: data.position.lat,
            longitude: data.position.lng,
            speed: data.speed, // ✨ Gửi cả tốc độ qua socket
          });
        }
      }
    );
  };

  const handleStopSimulation = () => {
    busSimulationService.stopSimulation(parentBus.id);
    setIsSimulating(false);
  };

  // Xử lý socket (nếu có real-time từ server)
  useEffect(() => {
    if (socket && MOCK_CHILD_BUS_ID) {
      const busSocketId = `bus_${MOCK_CHILD_BUS_ID}`;
      console.log(`Parent joining room: ${busSocketId}`);
      socket.emit("joinBusRoom", busSocketId);

      socket.on("locationUpdated", (data) => {
        console.log("Socket locationUpdated:", data);

        setBuses((prevBuses) =>
          prevBuses.map((bus) =>
            bus.id === data.busId || bus._id === data.busId
              ? {
                  ...bus,
                  position: { lat: data.latitude, lng: data.longitude },
                  latitude: data.latitude,
                  longitude: data.longitude,
                  status: "running",
                }
              : bus
          )
        );
      });

      return () => {
        socket.off("locationUpdated");
        socket.emit("leaveBusRoom", busSocketId);
      };
    }
  }, [socket, MOCK_CHILD_BUS_ID]);

  // Cleanup simulation khi unmount
  useEffect(() => {
    return () => {
      busSimulationService.stopAllSimulations();
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 70px - 48px)",
        width: "100%",
        gap: 2,
      }}
    >
      <BusList buses={buses} loading={busesLoading} error={busesError} />

      <Box
        sx={{
          flexGrow: 1,
          position: "relative",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <MapContainer buses={buses} loading={busesLoading} error={busesError} />
        <MapLegend />

        {/* Nút điều khiển simulation */}
        <Box
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 1000,
            display: "flex",
            gap: 1,
          }}
        >
          {!isSimulating ? (
            <Button
              variant="contained"
              color="success"
              startIcon={<PlayArrow />}
              onClick={handleStartSimulation}
              sx={{
                backgroundColor: "#28a745",
                "&:hover": { backgroundColor: "#218838" },
                fontWeight: 600,
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              Bắt đầu mô phỏng
            </Button>
          ) : (
            <Button
              variant="contained"
              color="error"
              startIcon={<Stop />}
              onClick={handleStopSimulation}
              sx={{
                fontWeight: 600,
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              Dừng mô phỏng
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MapPage;
