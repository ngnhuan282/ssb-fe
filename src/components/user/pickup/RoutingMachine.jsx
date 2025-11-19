  // src/components/driver/pickup/RoutingMachine.jsx
  import L from "leaflet";
  import "leaflet-routing-machine";
  import { useMap } from "react-leaflet";
  import { useEffect } from "react";

  // Nhận thêm prop onRouteFound
  const RoutingMachine = ({ start, end, onRouteFound }) => { 
    const map = useMap();

    useEffect(() => {
      if (!map || !start || !end) return;

      // Tạo control dẫn đường
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(start.lat, start.lng), // Vị trí bắt đầu
          L.latLng(end.lat, end.lng)      // Vị trí kết thúc
        ],
        addWaypoints: false, 
        draggableWaypoints: false,
        fitSelectedRoutes: true, 
        createMarker: () => null,
        show: false,
        routeWhileDragging: false,
        lineOptions: {
          styles: [{ color: '#2563eb', opacity: 0.9, weight: 6 }] 
        }
      }).addTo(map);

      // --- PHẦN MỚI: LẮNG NGHE SỰ KIỆN KHI TÌM THẤY ĐƯỜNG ---
      routingControl.on('routesfound', function(e) {
        const routes = e.routes;
        if (routes.length > 0 && onRouteFound) {
          // Lấy tất cả tọa độ từ tuyến đường đầu tiên
          // và chuyển đổi chúng từ L.LatLng sang object {lat, lng}
          const coordinates = routes[0].coordinates.map(coord => ({
            lat: coord.lat,
            lng: coord.lng
          }));
          
          // Gửi mảng tọa độ về cho component cha (DriverPickupPointPage)
          onRouteFound(coordinates);
        }
      });
      // --- KẾT THÚC PHẦN MỚI ---

      // Hàm dọn dẹp
      return () => {
        map.removeControl(routingControl);
      };
    }, [map, start, end, onRouteFound]); // Thêm onRouteFound vào dependency array

    return null; 
  };

  export default RoutingMachine;