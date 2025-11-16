// src/services/busSimulationService.js

class BusSimulationService {
  constructor() {
    this.simulations = new Map();
    this.SPEED_KMH = 40;
    this.CHECKPOINT_DISTANCE = 20;
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
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

      // Thêm segment, bỏ qua điểm đầu nếu không phải segment đầu tiên
      if (i === 0) {
        fullPath.push(...segment);
      } else {
        fullPath.push(...segment.slice(1));
      }
    }

    return fullPath;
  }

  interpolate(start, end, fraction) {
    return {
      lat: start.lat + (end.lat - start.lat) * fraction,
      lng: start.lng + (end.lng - start.lng) * fraction,
    };
  }

  async startSimulation(busId, stops, onUpdate) {
    // Dừng simulation cũ nếu có
    this.stopSimulation(busId);

    // Tạo route đầy đủ
    const fullPath = await this.buildFullRoute(stops);

    if (fullPath.length < 2) {
      console.error("Route too short");
      return;
    }

    // ✨ Tốc độ khởi đầu random 30-50 km/h
    let currentSpeed = Math.floor(Math.random() * 21) + 30;
    console.log(`🚌 Xe ${busId} bắt đầu với tốc độ: ${currentSpeed} km/h`);

    // Tính tổng khoảng cách của route
    let totalDistance = 0;
    for (let i = 0; i < fullPath.length - 1; i++) {
      totalDistance += this.calculateDistance(
        fullPath[i].lat,
        fullPath[i].lng,
        fullPath[i + 1].lat,
        fullPath[i + 1].lng
      );
    }

    // Tính thời gian trung bình (dùng tốc độ 40km/h làm chuẩn)
    const avgSpeed = 50;
    const totalTimeSeconds = (totalDistance / 1000 / avgSpeed) * 3600;

    // Cập nhật mỗi 1 giây
    const updateInterval = 1000; // ms
    const totalSteps = Math.floor(totalTimeSeconds);

    let currentStep = 0;
    let currentStopIndex = 0;
    let distanceCovered = 0;

    const intervalId = setInterval(() => {
      // ✨ THAY ĐỔI TỐC ĐỘ MỖI 2-5 GIÂY (random interval)
      const shouldChangeSpeed = Math.random() < 0.3; // 30% khả năng đổi tốc độ mỗi giây

      if (shouldChangeSpeed) {
        // Random thay đổi tốc độ: tăng/giảm 5-15 km/h
        const speedChange = Math.floor(Math.random() * 11) - 5; // -5 đến +5
        const newSpeed = currentSpeed + speedChange;

        // Giới hạn trong khoảng 20-60 km/h
        currentSpeed = Math.max(20, Math.min(60, newSpeed));

        // Log để debug
        console.log(
          `⚡ Giây ${currentStep}: Tốc độ mới = ${currentSpeed} km/h`
        );
      }

      const distancePerSecond = (currentSpeed * 1000) / 3600;
      distanceCovered += distancePerSecond;

      // Kiểm tra đã đến đích chưa
      if (distanceCovered >= totalDistance) {
        this.stopSimulation(busId);
        console.log(`✅ Xe ${busId} đã hoàn thành hành trình!`);
        return;
      }

      // Tìm vị trí hiện tại trên route
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
          // Nội suy trong segment này
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

      // Kiểm tra và cập nhật trạng thái các điểm đón
      const updatedStops = stops.map((stop, index) => {
        if (index < currentStopIndex) {
          return { ...stop, status: "completed" };
        }

        if (index === currentStopIndex) {
          const distanceToStop = this.calculateDistance(
            currentPosition.lat,
            currentPosition.lng,
            stop.position.lat,
            stop.position.lng
          );

          // Nếu xe đến gần điểm đón (trong vòng 100m)
          if (distanceToStop <= this.CHECKPOINT_DISTANCE) {
            currentStopIndex++;
            console.log(`✅ Xe ${busId} đã qua: ${stop.name}`);

            // ✨ Giảm tốc khi đến điểm đón (mô phỏng dừng/chậm lại)
            currentSpeed = Math.max(15, currentSpeed - 10);
            console.log(
              `🛑 Xe giảm tốc xuống ${currentSpeed} km/h tại ${stop.name}`
            );

            return { ...stop, status: "completed" };
          }
          return { ...stop, status: "current" };
        }

        return { ...stop, status: "pending" };
      });

      // Tính phần trăm hoàn thành
      const progress = Math.min(
        100,
        Math.round((distanceCovered / totalDistance) * 100)
      );

      onUpdate({
        busId,
        position: currentPosition,
        stops: updatedStops,
        progress: progress,
        speed: currentSpeed,
      });

      currentStep++;
    }, updateInterval);

    // Lưu simulation info
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
