import React from "react";
import { Marker } from "@react-google-maps/api";

const MapMarker = ({ bus }) => {
  const createBusIcon = (status) => ({
    url: `${window.location.origin}/assets/bus-${status}.png`,
    scaledSize: new window.google.maps.Size(32, 32),
  });

  return (
    <Marker
      key={bus.id}
      position={bus.position}
      icon={createBusIcon(bus.status)}
      title={`${bus.name} - ${bus.plate}`}
    />
  );
};

export default MapMarker;
