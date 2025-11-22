import { useState, useEffect } from "react";
import moment from "moment-timezone";
import {
  Box,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  IconButton,
  Paper,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { routeAPI, busAPI } from "../../services/api";
import RouteTable from "../../components/admin/route/RouteTable";
import RouteForm from "../../components/admin/route/RouteForm";
import RouteDeleteDialog from "../../components/admin/route/RouteDeleteDialog";
import Notification from "../../components/admin/layout/AdminNotification";

export default function RoutePage() {
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [editingRoute, setEditingRoute] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    stops: [],
    distance: "",
    estimatedTime: "",
    assignedBus: "",
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [stopListOpen, setStopListOpen] = useState(false);// state cho xem diem dung table
  const [currentStops, setCurrentStops] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [routeRes, busRes] = await Promise.all([routeAPI.getAll(), busAPI.getAll()]);
        setRoutes(routeRes.data.data);
        setBuses(busRes.data.data);
      } catch (err) {
        console.error("Fetch route error:", err);
      }
    }
    fetchAllData();
  }, []);

  const showNotification = (message, type = "success") => {
    setSnackbar({ open: true, message, type });
  };

  const handleCloseNotification = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenForm = (route = null) => {
    console.log("Buses :", buses)
    console.log("route :", routes)
    if (route) {
      setEditingRoute(route);
      setFormData({
        name: route.name || "",
        stops: route.stops || [],
        distance: route.distance || "",
        estimatedTime: route.estimatedTime || "",
        assignedBus: route.assignedBus?._id || "",
      });
    } else {
      setEditingRoute(null);
      setFormData({
        name: "",
        stops: [],
        distance: "",
        estimatedTime: "",
        assignedBus: ""
      });
    }
    setErrors({});
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingRoute(null);
    setFormData({ name: "", stops: [], distance: "", estimatedTime: "", assignedBus: "" });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addStop = () => {
    setFormData((prev) => ({ ...prev, stops: [...prev.stops, { location: "", time: "" }] }));
  };

  const removeStop = (index) => {
    setFormData((prev) => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index),
    }));
  };

  const handleStopChange = (index, key, value) => {
    const updatedStops = [...formData.stops];
    updatedStops[index][key] = value;
    setFormData((prev) => ({ ...prev, stops: updatedStops }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên tuyến đường";
    if (!formData.distance || Number(formData.distance) <= 0)
      newErrors.distance = "Quãng đường phải > 0";
    if (!formData.estimatedTime || Number(formData.estimatedTime) <= 0)
      newErrors.estimatedTime = "Thời gian dự kiến phải > 0";
    if (!formData.assignedBus) newErrors.assignedBus = "Vui lòng chọn xe phụ trách";
    if (!formData.stops || formData.stops.length === 0) {
      newErrors.stops = "Tuyến đường phải có ít nhất một điểm dừng";
    } else {
      const invalidStop = formData.stops.some(
        (stop) => !stop.location.trim() || !stop.time
      );
      if (invalidStop) newErrors.stops = "Vui lòng nhập đủ địa chỉ và thời gian cho tất cả điểm dừng";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    const geocodedStops = [];

    try {
      for (const [index, stop] of formData.stops.entries()) {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(stop.location)}&format=json&limit=1`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          geocodedStops.push({
            location: stop.location,
            time: stop.time,
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
          });
        } else {
          throw new Error(`Không tìm thấy tọa độ cho điểm dừng ${index + 1}: "${stop.location}"`);
        }
      }

      const cleanedFormData = { ...formData, stops: geocodedStops };

      let updatedRoutes;
      console.log("Form data gửi lên (ĐÃ DỊCH):", cleanedFormData);
      if (editingRoute) {
        const res = await routeAPI.update(editingRoute._id, cleanedFormData);
        updatedRoutes = routes.map((r) => (r._id === editingRoute._id ? res.data.data : r));
      } else {
        const res = await routeAPI.create(cleanedFormData);
        updatedRoutes = [...routes, res.data.data];
      }
      setRoutes(updatedRoutes);
      handleCloseForm();
      
      if (editingRoute) {
        showNotification('Cập nhật tuyến đường thành công!', 'success');
      } else {
        showNotification('Thêm tuyến đường thành công!', 'success');
      }
    } catch (err) {
      console.error("Save route error:", err);
      setErrors({ stops: err.message });
    }finally {  
      setIsSaving(false);
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await routeAPI.delete(deleteConfirm._id);
      setRoutes(routes.filter((r) => r._id !== deleteConfirm._id));
      showNotification('Xóa tuyến đường thành công!', 'success')
    } catch (err) {
      console.error("Delete route error:", err);
      showNotification('Xóa tuyến đường thất bại!', 'error')
    } finally {
      setDeleteConfirm(null);
    }
  }

  const rows = routes.map((r) => ({
    id: r._id,
    name: r.name,
    distance: r.distance,
    estimatedTime: r.estimatedTime,
    assignedBus: r.assignedBus?.licensePlate || "Chưa gán",
    stops: r.stops || [],
    createdAt: new Date(r.createdAt).toLocaleDateString(),
    updatedAt: new Date(r.updatedAt).toLocaleDateString(),
  }))

  const handleViewStops = (row) => {
    setCurrentStops(row.stops || []);
    setStopListOpen(true);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" mb={2} alignItems="center">
        <h2>Quản lý tuyến đường</h2>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
          sx={{
            background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
            color: "#fff",
            borderRadius: "12px",
            minHeight: "50px",
            textTransform: "none",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #4338ca 0%, #2563eb 100%)",
              boxShadow: "0 6px 16px rgba(59, 130, 246, 0.45)",
            },
          }}
        >
          Thêm tuyến đường
        </Button>
      </Stack>

      <RouteTable
        rows={rows}
        onViewStops={handleViewStops}
        routes={routes}
        onEdit={handleOpenForm}
        onDelete={setDeleteConfirm}
      />
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="md">
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
            color: "#fff",
            borderRadius: "4px 4px 0 0",
            fontWeight: 600,
          }}
        >
          {editingRoute ? "Sửa Tuyến Đường" : "Thêm Tuyến Đường"}
          <IconButton sx={{ position: "absolute", top: 8, right: 8, color: "#fff" }} onClick={handleCloseForm}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <RouteForm
            formData={formData}
            errors={errors}
            buses={buses}
            handleChange={handleChange}
            addStop={addStop}
            removeStop={removeStop}
            handleStopChange={handleStopChange}
          />
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseForm}>Hủy</Button>
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)" }}
              disabled={isSaving} // Vô hiệu hóa khi đang lưu
            >
              {isSaving ? <CircularProgress size={24} color="inherit" /> : (editingRoute ? "Cập nhật" : "Thêm")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <RouteDeleteDialog
        deleteConfirm={deleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
      />

      <Dialog open={stopListOpen} onClose={() => setStopListOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Danh sách điểm dừng</DialogTitle>
        <DialogContent sx={{ px: 3, pb: 3 }}>
          {currentStops.length > 0 ? (
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 2,
                boxShadow: 1,
                overflow: "auto",
              }}
            >
              <Table sx={{ width: "100%" }} aria-label="stops table">
                <TableHead sx={{ backgroundColor: "#f9fafb" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: "70%" }}>Tên điểm dừng</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: "30%", textAlign: "center" }}>
                      Thời gian dự kiến
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentStops.map((stop, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": { backgroundColor: "#f3f4f6" },
                      }}
                    >
                      <TableCell sx={{ pl: 3 }}>{stop.location}</TableCell>
                      <TableCell align="center">
                        {stop.time
                          ? moment(stop.time).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm")
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
              Chưa có điểm dừng nào.
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Notification
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={handleCloseNotification}
      />

    </Box>
  );
}