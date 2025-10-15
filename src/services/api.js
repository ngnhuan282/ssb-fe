import axiosInstance from "./axiosConfig";

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
  update: (id, data) => axiosInstance.put(`/drivers/${id}`, data),
  delete: (id) => axiosInstance.delete(`/drivers/${id}`),
};

export const locationAPI = {
  getAll: () => axiosInstance.get("/location"),
  getById: (id) => axiosInstance.get(`/location/${id}`),
  create: (data) => axiosInstance.post("/location", data),
  update: (id, data) => axiosInstance.put(`/location/${id}`, data),
  delete: (id) => axiosInstance.delete(`/location/${id}`),
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
};

export const userAPI = {
  getAll: () => axiosInstance.get("/users"),
  getById: (id) => axiosInstance.get(`/users/${id}`),
  create: (data) => axiosInstance.post("/users", data),
  update: (id, data) => axiosInstance.put(`/users/${id}`, data),
  delete: (id) => axiosInstance.delete(`/users/${id}`),
};
