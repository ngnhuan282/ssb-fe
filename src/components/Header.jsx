import React, { useState, useEffect } from "react";
import { Bus, MapPin, User } from "lucide-react";

const MapComponent = () => {
  const [buses, setBuses] = useState([
    {
      id: 1,
      name: "Xe 01 - 29A-12345",
      driver: "Trần Văn B",
      route: "Tuyến 1: Quận 1 - Quận 3",
      students: 15,
      status: "running",
    },
    {
      id: 2,
      name: "Xe 02 - 29B-67890",
      driver: "Lê Thị C",
      route: "Tuyến 2: Quận 2 - Bình Thạnh",
      students: 12,
      status: "running",
    },
    {
      id: 3,
      name: "Xe 03 - 29C-11111",
      driver: "Phạm Văn D",
      route: "Tuyến 3: Quận 10 - Tân Bình",
      students: 18,
      status: "stopped",
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => {
          if (bus.status === "running") {
            return {
              ...bus,
              lat: (Math.random() * 10).toFixed(4),
              lng: (Math.random() * 10).toFixed(4),
            };
          }
          return bus;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    return status === "running" ? "bg-green-500" : "bg-yellow-500";
  };

  const getStatusText = (status) => {
    return status === "running" ? "Đang chạy" : "Đang dừng";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Bus List */}
      <div className="w-80 bg-white shadow-lg overflow-y-auto">
        <div className="p-4 border-b bg-blue-600 text-white">
          <h2 className="text-lg font-bold">Danh sách xe buýt</h2>
          <p className="text-sm text-blue-100">
            {buses.filter((b) => b.status === "running").length}/{buses.length}{" "}
            xe đang hoạt động
          </p>
        </div>

        <div className="p-4 space-y-3">
          {buses.map((bus) => (
            <div
              key={bus.id}
              className={`p-4 border rounded-lg cursor-pointer hover:shadow-md ${
                bus.status === "running" ? "bg-green-50" : "bg-yellow-50"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Bus className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{bus.name}</h3>
                </div>
                <span
                  className={`${getStatusColor(
                    bus.status
                  )} w-3 h-3 rounded-full`}
                ></span>
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Tài xế: {bus.driver}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{bus.route}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs font-medium text-gray-700">
                    Học sinh: {bus.students}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      bus.status === "running"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {getStatusText(bus.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-8 grid-rows-8 h-full">
              {[...Array(64)].map((_, i) => (
                <div key={i} className="border border-gray-300"></div>
              ))}
            </div>
          </div>

          {/* Buses on Map */}
          {buses.map((bus) => {
            const x = Math.random() * 90; // Random position for demo
            const y = Math.random() * 90; // Random position for demo

            return (
              <div
                key={bus.id}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className="absolute"
              >
                <Bus
                  className={`w-8 h-8 ${
                    bus.status === "running"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                />
              </div>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm text-gray-900 mb-2">
              Chú thích
            </h3>
            <div className="flex items-center space-x-2 text-sm">
              <div className="bg-green-500 w-3 h-3 rounded-full"></div>
              <span className="text-gray-700">Đang chạy</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="bg-yellow-500 w-3 h-3 rounded-full"></div>
              <span className="text-gray-700">Đang dừng</span>
            </div>
          </div>

          {/* Real-time indicator */}
          <button className="absolute top-6 left-6 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">
              Cập nhật thời gian thực
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
