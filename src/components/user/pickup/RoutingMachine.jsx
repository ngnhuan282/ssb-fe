// src/components/driver/pickup/RoutingMachine.jsx
import L from "leaflet";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";

const RoutingMachine = ({ start, end, onRouteFound }) => { 
  const map = useMap();
  // Dùng useRef để giữ tham chiếu routingControl mà không gây re-render
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map || !start || !end) return;

    // Xóa control cũ nếu tồn tại trước khi tạo mới
    if (routingControlRef.current) {
      try {
        map.removeControl(routingControlRef.current);
      } catch (e) {
        console.warn("Cleanup routing warning:", e);
      }
    }

    // Tạo control dẫn đường mới
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start.lat, start.lng),
        L.latLng(end.lat, end.lng)
      ],
      addWaypoints: false, 
      draggableWaypoints: false,
      fitSelectedRoutes: true, 
      createMarker: () => null,
      show: false, // Ẩn hướng dẫn text
      routeWhileDragging: false,
      lineOptions: {
        styles: [{ color: '#2563eb', opacity: 0.9, weight: 6 }] 
      }
    });

    // Thêm vào map và lưu tham chiếu
    routingControl.addTo(map);
    routingControlRef.current = routingControl;

    // Lắng nghe sự kiện tìm thấy đường
    routingControl.on('routesfound', function(e) {
      const routes = e.routes;
      if (routes.length > 0 && onRouteFound) {
        const coordinates = routes[0].coordinates.map(coord => ({
          lat: coord.lat,
          lng: coord.lng
        }));
        onRouteFound(coordinates);
      }
    });

    // Hàm dọn dẹp khi unmount
    return () => {
      if (routingControlRef.current) {
        try {
          map.removeControl(routingControlRef.current);
          routingControlRef.current = null;
        } catch (e) {
          console.warn("Error removing routing control:", e);
        }
      }
    };
  }, [map, start, end]); // Bỏ onRouteFound ra khỏi dependency để tránh loop

  return null; 
};

export default RoutingMachine;