import React, { useState, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Box, Typography } from "@mui/material";

const containerStyle = { width: "100%", height: "100%" };
const center = { lat: 10.775843, lng: 106.660172 };

const MapContainer = ({ buses }) => {
  const [map, setMap] = useState(null);
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places", "geometry"],
  });

  const onLoad = useCallback((mapInstance) => {
    if (window.google?.maps?.LatLngBounds) {
      const bounds = new window.google.maps.LatLngBounds();
      buses.forEach((bus) => bounds.extend(bus.position));
      mapInstance.fitBounds(bounds);
    }
    setMap(mapInstance);
  }, [buses]);

  const createBusIcon = (status) => ({
    url: `${window.location.origin}/assets/bus-${status}.png`,
    scaledSize: new window.google.maps.Size(32, 32),
  });

  if (loadError) return <div>Lỗi khi tải bản đồ</div>;

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onLoad={onLoad}
      onUnmount={() => setMap(null)}
      options={{ disableDefaultUI: true, zoomControl: true }}
    >
      {buses.map(bus => (
        <Marker key={bus.id} position={bus.position} icon={createBusIcon(bus.status)} />
      ))}
    </GoogleMap>
  ) : (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
      <Typography>Đang tải bản đồ...</Typography>
    </Box>
  );
};

export default MapContainer;
