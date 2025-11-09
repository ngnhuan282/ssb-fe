// src/utils/distance.js

/**
 * Tính khoảng cách giữa 2 điểm tọa độ (Haversine formula)
 * @param {number} lat1 - Vĩ độ điểm 1
 * @param {number} lon1 - Kinh độ điểm 1
 * @param {number} lat2 - Vĩ độ điểm 2
 * @param {number} lon2 - Kinh độ điểm 2
 * @returns {Object} { km: số km, m: số mét, toString: hàm format chuỗi }
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  const distanceM = distanceKm * 1000;

  const toString = () => {
    if (distanceKm < 1) {
      return `${Math.round(distanceM)}m`;
    } else {
      return `${distanceKm.toFixed(1)}km`;
    }
  };

  return {
    km: distanceKm,
    m: distanceM,
    toString
  };
};

/**
 * Ước lượng thời gian di chuyển (giả sử tốc độ trung bình 30km/h trong thành phố)
 * @param {number} distanceKm - Khoảng cách (km)
 * @param {number} speedKmh - Tốc độ trung bình (km/h), mặc định 30
 * @returns {string} Chuỗi thời gian ước lượng
 */
export const estimateTravelTime = (distanceKm, speedKmh = 30) => {
  const minutes = (distanceKm / speedKmh) * 60;
  if (minutes < 1) return '<1 phút';
  if (minutes < 60) return `${Math.round(minutes)} phút`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h${mins > 0 ? `${mins} phút` : ''}`;
};

/**
 * Tính khoảng cách + thời gian từ vị trí hiện tại đến điểm dừng
 * @param {Object} currentLocation - { lat, lng }
 * @param {Object} stopLocation - { lat, lng }
 * @param {number} speedKmh - Tốc độ ước lượng
 * @returns {Object} { distance: string, estimatedTime: string }
 */
export const getStopTravelInfo = (currentLocation, stopLocation, speedKmh = 30) => {
  if (!currentLocation || !stopLocation) {
    return { distance: 'N/A', estimatedTime: 'N/A' };
  }

  const { km, toString } = calculateDistance(
    currentLocation.lat,
    currentLocation.lng,
    stopLocation.lat,
    stopLocation.lng
  );

  const distance = toString();
  const estimatedTime = estimateTravelTime(km, speedKmh);

  return { distance, estimatedTime };
};