// src/services/busSimulationService.js

class BusSimulationService {
  constructor() {
    this.simulations = new Map();
    this.SPEED_KMH = 40;
    // Tăng khoảng cách check-in lên 80m để đảm bảo bắt được trạm dù GPS lệch
    this.CHECKPOINT_DISTANCE = 80;
  }

  // Hàm tính khoảng cách giữa 2 tọa độ (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Bán kính trái đất (mét)
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // Gọi API OSRM để lấy đường đi thực tế
  async getRoute(startLat, startLng, endLat, endLng) {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === "Ok" && data.routes && data.routes.length > 0) {
        return data.routes[0].geometry.coordinates.map((coord) => ({
          lat: coord[1],
          lng: coord[0],
        }));
      }

      // Fallback: Nếu lỗi thì trả về đường chim bay
      return [
        { lat: startLat, lng: startLng },
        { lat: endLat, lng: endLng },
      ];
    } catch (error) {
      console.error("Error fetching route:", error);
      return [
        { lat: startLat, lng: startLng },
        { lat: endLat, lng: endLng },
      ];
    }
  }

  // Xây dựng lộ trình đầy đủ qua tất cả các điểm dừng
  async buildFullRoute(stops) {
    const fullPath = [];

    for (let i = 0; i < stops.length - 1; i++) {
      const start = stops[i].position;
      const end = stops[i + 1].position;

      const segment = await this.getRoute(
        start.lat,
        start.lng,
        end.lat,
        end.lng
      );

      if (i === 0) {
        fullPath.push(...segment);
      } else {
        fullPath.push(...segment.slice(1)); // Tránh trùng điểm nối
      }
    }

    return fullPath;
  }

  // Nội suy vị trí giữa 2 điểm tọa độ
  interpolate(start, end, fraction) {
    return {
      lat: start.lat + (end.lat - start.lat) * fraction,
      lng: start.lng + (end.lng - start.lng) * fraction,
    };
  }

  async startSimulation(busId, stops, onUpdate) {
    this.stopSimulation(busId);

    const fullPath = await this.buildFullRoute(stops);

    if (fullPath.length < 2) {
      console.error("Route too short");
      return;
    }

    let currentSpeed = Math.floor(Math.random() * 21) + 30; // 30-50 km/h

    // Tính tổng quãng đường
    let totalDistance = 0;
    for (let i = 0; i < fullPath.length - 1; i++) {
      totalDistance += this.calculateDistance(
        fullPath[i].lat,
        fullPath[i].lng,
        fullPath[i + 1].lat,
        fullPath[i + 1].lng
      );
    }

    const updateInterval = 1000; // 1 giây cập nhật 1 lần
    let currentStopIndex = 0;
    let distanceCovered = 0;

    // Reset trạng thái cảnh báo của các trạm
    stops.forEach((stop) => {
      stop.alertedApproaching = false;
      stop.alertedLate = false;
    });

    const intervalId = setInterval(() => {
      // 1. Giả lập thay đổi tốc độ ngẫu nhiên
      if (Math.random() < 0.3) {
        const change = Math.floor(Math.random() * 11) - 5;
        currentSpeed = Math.max(20, Math.min(60, currentSpeed + change));
      }

      const distancePerSecond = (currentSpeed * 1000) / 3600;
      distanceCovered += distancePerSecond;

      // 2. Kiểm tra kết thúc hành trình
      if (distanceCovered >= totalDistance) {
        this.stopSimulation(busId);
        onUpdate({
          busId,
          position: fullPath[fullPath.length - 1],
          progress: 100,
          speed: 0,
          alerts: [],
          stops: stops.map((s) => ({ ...s, status: "completed" })),
        });
        return;
      }

      // 3. Tìm vị trí hiện tại trên line đường (Project to path)
      let accumulatedDistance = 0;
      let currentPosition = fullPath[0];

      for (let i = 0; i < fullPath.length - 1; i++) {
        const segmentDistance = this.calculateDistance(
          fullPath[i].lat,
          fullPath[i].lng,
          fullPath[i + 1].lat,
          fullPath[i + 1].lng
        );

        if (accumulatedDistance + segmentDistance >= distanceCovered) {
          const segmentProgress =
            (distanceCovered - accumulatedDistance) / segmentDistance;
          currentPosition = this.interpolate(
            fullPath[i],
            fullPath[i + 1],
            segmentProgress
          );
          break;
        }
        accumulatedDistance += segmentDistance;
      }

      // 4. XỬ LÝ LOGIC TRẠM & CẢNH BÁO
      const alerts = [];
      const updatedStops = stops.map((stop, index) => {
        // Trạm đã đi qua
        if (index < currentStopIndex) {
          return { ...stop, status: "completed" };
        }

        // Trạm hiện tại đang hướng tới
        if (index === currentStopIndex) {
          const distanceToStop = this.calculateDistance(
            currentPosition.lat,
            currentPosition.lng,
            stop.position.lat,
            stop.position.lng
          );

          // --- LOGIC A: CẢNH BÁO SẮP ĐẾN (150m) ---
          // Báo trước khi vào vùng checkpoint để người dùng kịp chuẩn bị
          if (!stop.alertedApproaching && distanceToStop <= 150) {
            stop.alertedApproaching = true;
            currentSpeed = 25; // Giảm tốc độ để người dùng dễ quan sát

            alerts.push({
              type: "approaching",
              title: "Xe sắp đến điểm đón",
              message: `Xe sắp đến trạm "${stop.name}" (cách ~${Math.round(
                distanceToStop
              )}m)`,
              stopName: stop.name,
              distance: Math.round(distanceToStop),
              estimatedMinutes: 1,
            });
          }

          // --- LOGIC B: ĐÃ ĐẾN TRẠM (80m) ---
          // Dùng 80m thay vì 20m để khắc phục lỗi xe chạy lướt qua trạm
          if (distanceToStop <= this.CHECKPOINT_DISTANCE) {
            currentStopIndex++; // Chuyển sang trạm tiếp theo
            currentSpeed = 15; // Xe đi rất chậm khi qua trạm

            // Nếu chưa kịp báo sắp đến mà đã đến luôn thì báo "Đã đến"
            if (!stop.alertedApproaching) {
              alerts.push({
                type: "approaching",
                title: "Xe đã đến điểm đón",
                message: `Xe đã đến trạm "${stop.name}"`,
                stopName: stop.name,
                distance: 0,
                estimatedMinutes: 0,
              });
              stop.alertedApproaching = true;
            }
            return { ...stop, status: "completed" };
          }

          // --- LOGIC C: CẢNH BÁO TRỄ GIỜ ---
          if (stop.expectedTime && !stop.alertedLate) {
            const expectedTime = new Date(stop.expectedTime).getTime();
            const now = Date.now();
            const delayMinutes = Math.floor((now - expectedTime) / 60000);

            // Nếu trễ > 0 phút là báo ngay
            if (delayMinutes > 0) {
              stop.alertedLate = true;
              alerts.push({
                type: "late",
                title: "Cảnh báo trễ giờ",
                message: `Xe trễ ${delayMinutes} phút tại "${stop.name}"`,
                stopName: stop.name,
                delayMinutes,
              });
            }
          }

          return { ...stop, status: "current" };
        }

        // Các trạm chưa tới
        return { ...stop, status: "pending" };
      });

      const progress = Math.min(
        100,
        Math.round((distanceCovered / totalDistance) * 100)
      );

      // Gửi dữ liệu cập nhật về UI
      onUpdate({
        busId,
        position: currentPosition,
        stops: updatedStops,
        progress,
        speed: Math.round(currentSpeed),
        alerts,
      });
    }, updateInterval);

    this.simulations.set(busId, {
      intervalId,
      stops,
      fullPath,
      speed: currentSpeed,
    });
  }

  stopSimulation(busId) {
    const simulation = this.simulations.get(busId);
    if (simulation) {
      clearInterval(simulation.intervalId);
      this.simulations.delete(busId);
    }
  }

  stopAllSimulations() {
    this.simulations.forEach((simulation, busId) => {
      this.stopSimulation(busId);
    });
  }
}

export default new BusSimulationService();
