import React, { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import "./Map.css";
import Header from "./Header.jsx";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const libraries = ["places", "geometry"];

const mockBusData = [
  {
    id: "01",
    name: "Xe 01",
    plate: "29A-12345",
    driver: "Trần Văn B",
    route: "Tuyến 1: Quận 1 - Quận 3",
    students: 15,
    status: "running",
    position: { lat: 10.762622, lng: 106.660172 },
  },
  {
    id: "02",
    name: "Xe 02",
    plate: "29B-67890",
    driver: "Lê Thị C",
    route: "Tuyến 2: Quận 2 - Bình Thạnh",
    students: 12,
    status: "running",
    position: { lat: 10.794155, lng: 106.7 },
  },
  {
    id: "03",
    name: "Xe 03",
    plate: "29C-11111",
    driver: "Phạm Văn D",
    route: "Tuyến 3: Quận 10 - Tân Bình",
    students: 18,
    status: "stopped",
    position: { lat: 10.77, lng: 106.68 },
  },
];

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 10.775843,
  lng: 106.660172,
};

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [buses, setBuses] = useState(mockBusData);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const onLoad = useCallback(
    (mapInstance) => {
      if (window.google?.maps?.LatLngBounds) {
        const bounds = new window.google.maps.LatLngBounds();
        buses.forEach((bus) => {
          bounds.extend(
            new window.google.maps.LatLng(bus.position.lat, bus.position.lng)
          );
        });
        mapInstance.fitBounds(bounds);
      }
      setMap(mapInstance);
    },
    [buses]
  );

  const onUnmount = useCallback((_mapInstance) => {
    setMap(null);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const createBusIcon = (status) => {
    const iconBaseUrl = window.location.origin;
    return {
      url: `${iconBaseUrl}/assets/bus-${status}.png`,
      scaledSize: new window.google.maps.Size(32, 32),
    };
  };

  if (loadError)
    return <div>Lỗi khi tải bản đồ. Vui lòng kiểm tra API Key.</div>;

  return (
    <div className="map-page-container">
      {}
      <Header onMenuClick={toggleMenu} />

      {}
      <div className={`app-sidebar-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="menu-header">
          {}
          <div className="menu-title">
            <span className="title-text">SSB 1.0</span>
            <span className="subtitle-text">Smart School Bus</span>
          </div>
          <div className="close-icon" onClick={toggleMenu}>
            &times;
          </div>
        </div>

        <ul className="menu-list">
          <li>
            <a href="#">Tổng quan</a>
          </li>
          <li>
            <a href="#">Quản lý xe</a>
          </li>
          <li>
            <a href="#">Lịch trình</a>
          </li>
          <li>
            <a href="#">Báo cáo</a>
          </li>
        </ul>

        <div className="menu-footer">
          <h4>Nguyễn Văn A</h4>
          <p>Admin</p>
        </div>
      </div>
      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}

      {}
      <div className="main-content-wrapper">
        <div className="bus-list-sidebar">
          <div className="sidebar-header">
            <h2>Danh sách xe buýt</h2>
            <p>
              {buses.filter((bus) => bus.status === "running").length}/
              {buses.length} xe đang hoạt động đồng thời
            </p>
          </div>
          <div className="bus-items-container">
            {buses.map((bus) => (
              <div
                key={bus.id}
                className={`bus-item ${
                  bus.status === "running"
                    ? "bus-item-running"
                    : "bus-item-stopped"
                }`}
              >
                <div className="bus-status-indicator"></div>
                <div className="bus-info">
                  <h3>
                    {bus.name} - {bus.plate}
                  </h3>
                  <p>👤 Tài xế: {bus.driver}</p>
                  <p>🛣️ Tuyến: {bus.route}</p>
                  <p>🧑‍🎓 Học sinh: {bus.students}</p>
                </div>
                <div
                  className="bus-status-badge"
                  style={{
                    backgroundColor:
                      bus.status === "running" ? "#28a745" : "#ffc107",
                  }}
                >
                  {bus.status === "running" ? "Đang chạy" : "Đang dừng"}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="map-view-container">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={12}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                disableDefaultUI: true,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              {buses.map((bus) => (
                <Marker
                  key={bus.id}
                  position={bus.position}
                  icon={createBusIcon(bus.status)}
                  title={`${bus.name} - ${bus.plate} (${
                    bus.status === "running" ? "Đang chạy" : "Đang dừng"
                  })`}
                />
              ))}
            </GoogleMap>
          ) : (
            <div>Đang tải bản đồ...</div>
          )}
          <div className="map-legend">
            <h3>Chú thích</h3>
            <div className="legend-item">
              <span className="legend-color-box running"></span> Đang chạy
            </div>
            <div className="legend-item">
              <span className="legend-color-box stopped"></span> Đang dừng
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
