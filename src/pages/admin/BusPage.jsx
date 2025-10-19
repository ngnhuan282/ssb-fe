import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  IconButton,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { busAPI } from "../../services/api";
import { driverAPI } from "../../services/api";
import { routeAPI } from "../../services/api";
import BusTable from "../../components/admin/buses/BusTable";
import BusForm from "../../components/admin/buses/BusForm";
import BusDeleteDialog from "../../components/admin/buses/BusDeleteDialog";

export default function BusPage() {
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [lastDeleteData, setLastDeleteData] = useState(null);
  const [formData, setFormData] = useState({
    licensePlate: "",
    capacity: "",
    currentStatus: "active",
    driver: "",
    route: "",
  });
  const [errors, setErrors] = useState({});
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [busRes, driverRes, routeRes] = await Promise.all([
          busAPI.getAll(),
          driverAPI.getAll(),
          routeAPI.getAll(),
        ]);
        setBuses(busRes.data.data);
        setDrivers(driverRes.data.data);
        setRoutes(routeRes.data.data);
      } catch (err) {
        console.error("Fetch buses error:", err);
      }
    };
    fetchAllData();
  }, []);

  const handleOpenForm = (bus = null) => {
    if (bus) {
      setEditingBus(bus);
      setFormData({
        ...bus,
        driver: bus.driver?._id || "",
        route: bus.route?._id || "",
      });
    } else {
      setEditingBus(null);
      setFormData({
        licensePlate: "",
        capacity: "",
        currentStatus: "active",
        driver: "",
        route: "",
      });
    }
    setErrors({});
    setOpenForm(true);
  };

  const handleCloseForm = () => setOpenForm(false);

  const handleFormExited = () => {
    setEditingBus(null);
    setFormData({
      licensePlate: "",
      capacity: "",
      currentStatus: "active",
      driver: "",
      route: "",
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.licensePlate.trim()) newErrors.licensePlate = "Biển số là bắt buộc";
    if (!formData.capacity || isNaN(formData.capacity) || Number(formData.capacity) < 10)
      newErrors.capacity = "Sức chứa phải là số và tối thiểu 10";
    if (!formData.driver) newErrors.driver = "Vui lòng chọn tài xế";
    if (!formData.route) newErrors.route = "Vui lòng chọn tuyến đường";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      let updatedBuses;
      if (editingBus) {
        const res = await busAPI.update(editingBus._id, formData);
        updatedBuses = buses.map((b) =>
          b._id === editingBus._id ? res.data.data : b
        );
      } else {
        const res = await busAPI.create(formData);
        updatedBuses = [...buses, res.data.data];
      }
      setBuses(updatedBuses);
      handleCloseForm();
    } catch (err) {
      console.error("Save bus error:", err);
    }
  };

  const handleOpenDelete = (bus) => setDeleteConfirm(bus);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await busAPI.delete(deleteConfirm._id);
      const updated = buses.filter((b) => b._id !== deleteConfirm._id);
      setBuses(updated);
      setLastDeleteData({
        ...deleteConfirm,
        deletedAt: new Date().toLocaleString(),
      });
    } catch (err) {
      console.error("Delete bus error:", err);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const rows = buses.map((b) => ({
    id: b._id,
    licensePlate: b.licensePlate,
    capacity: b.capacity,
    currentStatus: b.currentStatus === "active" ? "Hoạt động" : "Bảo dưỡng",
    driver: b.driver?.fullName || "Chưa có",
    route: b.route?.name || "Chưa có",
    createdAt: new Date(b.createdAt).toLocaleDateString(),
    updatedAt: new Date(b.updatedAt).toLocaleDateString(),
  }));

  return (
    <Box sx={{ p: 3, overflowY: "auto" }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ textAlign: "center", color: "#007bff" }}
      >
        Quản Lý Xe Buýt
      </Typography>

      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
          sx={{
            backgroundColor: "#007bff",
            "&:hover": { backgroundColor: "#0056b3" },
          }}
        >
          Thêm Xe Buýt
        </Button>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={10}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: "#333" }}>
                Danh Sách Xe Buýt
              </Typography>

              <BusTable
                rows={rows}
                buses={buses}
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
                onEdit={handleOpenForm}
                onDelete={handleOpenDelete}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Form thêm/sửa */}
      <Dialog
        open={openForm}
        onClose={handleCloseForm}
        onTransitionExited={handleFormExited}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "4px 4px 0 0",
          }}
        >
          {editingBus ? "Sửa Xe Buýt" : "Thêm Xe Buýt"}
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8, color: "#fff" }}
            onClick={handleCloseForm}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <BusForm
            formData={formData}
            errors={errors}
            drivers={drivers}
            routes={routes}
            handleChange={handleChange}
          />

          <DialogActions>
            <Button onClick={handleCloseForm} sx={{ color: "#333" }}>
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#007bff",
                "&:hover": { backgroundColor: "#0056b3" },
              }}
            >
              {editingBus ? "Cập Nhật" : "Thêm"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <BusDeleteDialog
        deleteConfirm={deleteConfirm}
        lastDeleteData={lastDeleteData}
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}