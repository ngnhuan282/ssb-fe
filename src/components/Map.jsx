import React, { useState, useEffect } from "react";
import { Bus, User, MapPin, X, Clock } from "lucide-react";

const MapComponent = () => {
  const [buses, setBuses] = useState([
    {
      id: 1,
      name: "Xe 01 - 29A-12345",
      driver: "Trần Văn B",
      lat: 10.8231,
      lng: 106.6297,
      students: 15,
      status: "running",
      route: "Tuyến 1: Quận 1 - Quận 3",
    },
    {
      id: 2,
      name: "Xe 02 - 29B-67890",
      driver: "Lê Thị C",
      lat: 10.7769,
      lng: 106.7009,
      students: 12,
      status: "running",
      route: "Tuyến 2: Quận 2 - Bình Thạnh",
    },
    {
      id: 3,
      name: "Xe 03 - 29C-11111",
      driver: "Phạm Văn D",
      lat: 10.8055,
      lng: 106.6519,
      students: 18,
      status: "stopped",
      route: "Tuyến 3: Quận 10 - Tân Bình",
    },
  ]);

  const [selectedBus, setSelectedBus] = useState(null);

  // Simulate real-time GPS updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => {
          if (bus.status === "running") {
            return {
              ...bus,
              lat: bus.lat + (Math.random() - 0.5) * 0.001,
              lng: bus.lng + (Math.random() - 0.5) * 0.001,
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
              onClick={() => setSelectedBus(bus)}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                selectedBus?.id === bus.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
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
            const x = ((bus.lng - 106.6) / 0.15) * 100;
            const y = ((10.85 - bus.lat) / 0.1) * 100;

            return (
              <div
                key={bus.id}
                onClick={() => setSelectedBus(bus)}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className={`absolute cursor-pointer transition-all duration-300 ${
                  selectedBus?.id === bus.id
                    ? "scale-125 z-10"
                    : "hover:scale-110"
                }`}
              >
                <div className="relative">
                  <Bus
                    className={`w-8 h-8 ${
                      bus.status === "running"
                        ? "text-green-600"
                        : "text-yellow-600"
                    } drop-shadow-lg`}
                  />
                  <div
                    className={`absolute -top-1 -right-1 ${getStatusColor(
                      bus.status
                    )} w-3 h-3 rounded-full border-2 border-white`}
                  ></div>
                </div>
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

          {/* Selected Bus Info */}
          {selectedBus && (
            <div className="absolute top-6 right-6 bg-white rounded-lg shadow-xl p-6 w-80">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {selectedBus.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedBus.route}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBus(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Tài xế</span>
                  <span className="font-medium text-gray-900">
                    {selectedBus.driver}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Số học sinh</span>
                  <span className="font-medium text-gray-900">
                    {selectedBus.students}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Trạng thái</span>
                  <span
                    className={`font-medium ${
                      selectedBus.status === "running"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {getStatusText(selectedBus.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Tọa độ</span>
                  <span className="font-mono text-xs text-gray-900">
                    {selectedBus.lat.toFixed(4)}, {selectedBus.lng.toFixed(4)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                  Xem chi tiết
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
                  Gửi tin nhắn
                </button>
              </div>
            </div>
          )}

          {/* Real-time indicator */}
          <div className="absolute top-6 left-6 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center space-x-2">
            <div className="relative">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="absolute top-0 right-0 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700">
              Cập nhật thời gian thực
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
