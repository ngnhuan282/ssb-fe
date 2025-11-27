import axiosInstance from "./axiosCustomize";

export const busAPI = {
  getAll: () => axiosInstance.get("/buses"),
  getById: (id) => axiosInstance.get(`/buses/${id}`),
  create: (data) => axiosInstance.post("/buses", data),
  update: (id, data) => axiosInstance.put(`/buses/${id}`, data),
  delete: (id) => axiosInstance.delete(`/buses/${id}`),
};

export const driverAPI = {
  getAll: () => axiosInstance.get("/drivers"),
  getById: (id) => axiosInstance.get(`/drivers/${id}`),
  create: (data) => axiosInstance.post("/drivers", data),
  update: (id, data, updateUser) => axiosInstance.put(`/drivers/${id}`, data),
  delete: (id, data) => axiosInstance.delete(`/drivers/${id}`, data),
};

export const locationAPI = {
  getAll: () => axiosInstance.get("/location"),
  getById: (id) => axiosInstance.get(`/location/${id}`),
  create: (data) => axiosInstance.post("/location", data),
  update: (id, data) => axiosInstance.put(`/location/${id}`, data),
  delete: (id) => axiosInstance.delete(`/location/${id}`),
  getLatestByBus: (busId) => axiosInstance.get(`/location/bus/${busId}/latest`),
};

export const routeAPI = {
  getAll: () => axiosInstance.get("/routes"),
  getById: (id) => axiosInstance.get(`/routes/${id}`),
  create: (data) => axiosInstance.post("/routes", data),
  update: (id, data) => axiosInstance.put(`/routes/${id}`, data),
  delete: (id) => axiosInstance.delete(`/routes/${id}`),
};

export const scheduleAPI = {
  getAll: () => axiosInstance.get("/schedules"),
  getById: (id) => axiosInstance.get(`/schedules/${id}`),
  create: (data) => axiosInstance.post("/schedules", data),
  update: (id, data) => axiosInstance.put(`/schedules/${id}`, data),
  delete: (id) => axiosInstance.delete(`/schedules/${id}`),
  getByDriver: (driverId) => axiosInstance.get(`/schedules/driver/${driverId}`),

  // Các hàm custom khác nếu bạn có dùng
  getStopStudents: (scheduleId, stopIndex) =>
    axiosInstance.get(`/schedules/${scheduleId}/stops/${stopIndex}/students`),

  updateStop: (scheduleId, stopIndex, data) =>
    axiosInstance.patch(`/schedules/${scheduleId}/stops/${stopIndex}`, data),

  updateStudentStatus: (scheduleId, stopIndex, studentId, data) =>
    axiosInstance.patch(
      `/schedules/${scheduleId}/stops/${stopIndex}/students/${studentId}`,
      data
    ),
};

export const studentAPI = {
  getAll: () => axiosInstance.get("/students"),
  getById: (id) => axiosInstance.get(`/students/${id}`),
  create: (data) => axiosInstance.post("/students", data),
  update: (id, data) => axiosInstance.put(`/students/${id}`, data),
  delete: (id) => axiosInstance.delete(`/students/${id}`),
};

export const parentAPI = {
  getAll: () => axiosInstance.get("/parents"),
  getById: (id) => axiosInstance.get(`/parents/${id}`),
  create: (data) => axiosInstance.post("/parents", data),
  update: (id, data) => axiosInstance.put(`/parents/${id}`, data),
  delete: (id) => axiosInstance.delete(`/parents/${id}`),
};

export const notificationAPI = {
  getAll: () => axiosInstance.get("/notifications"),
  getById: (id) => axiosInstance.get(`/notifications/${id}`),
  create: (data) => axiosInstance.post("/notifications", data),
  update: (id, data) => axiosInstance.put(`/notifications/${id}`, data),
  delete: (id) => axiosInstance.delete(`/notifications/${id}`),

  // API lấy danh sách sự cố khẩn cấp (cho admin/tài xế xem)
  getEmergency: () => axiosInstance.get("/notifications/incidents"),

  // API tạo sự cố (có upload ảnh)
  createIncident: (data) =>
    axiosInstance.post("/notifications/incident", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // [QUAN TRỌNG] API lấy thông báo cho phụ huynh
  getMyNotifications: (userId) =>
    axiosInstance.get("/notifications/my-notifications", {
      params: { userId },
    }),
    
  createNotificationForOneUser: (data) => axiosInstance.post("/notifications/one-user", data),
  createNotificationsForUsers: (data) => axiosInstance.post("/notifications/users", data),

};

export const userAPI = {
  getAll: () => axiosInstance.get("/users"),
  getById: (id) => axiosInstance.get(`/users/${id}`),
  create: (data) => axiosInstance.post("/users", data),
  update: (id, data) => axiosInstance.put(`/users/${id}`, data),
  delete: (id) => axiosInstance.delete(`/users/${id}`),
};

export const authAPI = {
  login: (credentials) => axiosInstance.post("/auth/login", credentials),
  register: (data) => axiosInstance.post("/auth/register", data),
  logout: () => axiosInstance.post("/auth/logout"),
  refreshToken: () => axiosInstance.post("/auth/refresh-token"),
  getCurrentUser: () => axiosInstance.get("/auth/me"),
};
export const stopAssignmentAPI = {
  getStudentsByStop: (scheduleId, stopIndex) =>
    axiosInstance.get(`/schedules/${scheduleId}/stops/${stopIndex}/students`),
  updateStudentStatus: (scheduleId, stopIndex, studentId, data) =>
    axiosInstance.patch(
      `/schedules/${scheduleId}/stops/${stopIndex}/students/${studentId}`,
      data
    ),
};
