import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  IconButton,
  Snackbar,
  Alert,
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
  const [buses, setBuses] = useState([])
  const [drivers, setDrivers] = useState([])
  const [routes, setRoutes] = useState([])
  const [openForm, setOpenForm] = useState(false)
  const [editingBus, setEditingBus] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [lastDeleteData, setLastDeleteData] = useState(null)
  const [formData, setFormData] = useState({
    licensePlate: "",
    capacity: "",
    currentStatus: "active",
    driver: "",
    route: "",
  })
  const [errors, setErrors] = useState({})
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });


  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [busRes, driverRes, routeRes] = await Promise.all([
          busAPI.getAll(),
          driverAPI.getAll(),
          routeAPI.getAll(),
        ]);

        console.log("Buses :", busRes.data.data)

        setBuses(busRes.data.data)
        setDrivers(driverRes.data.data)
        setRoutes(routeRes.data.data)
      } catch (err) {
        console.error("Fetch buses error:", err);
      }
    };
    fetchAllData();
  }, []);

  const handleOpenForm = (bus = null) => {
  if (bus) {
    setEditingBus(bus)
    setFormData({
      licensePlate: bus.licensePlate || "",
      capacity: bus.capacity || "",
      currentStatus: bus.currentStatus || "active",
      driver: bus.driver?._id || "",
      route: bus.route?._id || "",
    });
  } else {
    setEditingBus(null)
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

  const handleCloseForm = () => {
    setOpenForm(false)
    setEditingBus(null)
    setFormData({
      licensePlate: "",
      capacity: "",
      currentStatus: "active",
      driver: "",
      route: "",
    });
    setErrors({})
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.licensePlate.trim()) newErrors.licensePlate = "Biển số là bắt buộc"
    if (!formData.capacity || isNaN(formData.capacity) || Number(formData.capacity) < 10)
      newErrors.capacity = "Sức chứa phải là số và tối thiểu 10"
    if (!formData.driver) newErrors.driver = "Vui lòng chọn tài xế"
    if (!formData.route) newErrors.route = "Vui lòng chọn tuyến đường"
    return newErrors
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    //check trung 
    const exists = buses.some((b) => b.licensePlate.trim().toLowerCase() === formData.licensePlate.trim().toLowerCase() && b._id !== editingBus?._id)
    if(exists) {
      setErrors({ licensePlate: "Biển số này đã tồn tại trong hệ thống" });
      return;
    }
    try {
      let updatedBuses
      if (editingBus) {
          console.log("Form data gửi lên:", formData)
        const res = await busAPI.update(editingBus._id, formData)
        updatedBuses = buses.map((b) =>
          b._id === editingBus._id ? res.data.data : b
        )
      } else {
        const res = await busAPI.create(formData)
        updatedBuses = [...buses, res.data.data]
      }
      setBuses(updatedBuses)
      handleCloseForm()
      //snackbar
      if(editingBus){
        setSnackbar({
        open: true,
        message: '✅ Cập nhật xe buýt thành công!',
        severity: 'success'
        });
      }else{
        setSnackbar({
        open: true,
        message: '🚌 Thêm xe buýt thành công!',
        severity: 'success'
        });
      }

    } catch (err) {
      console.error("Save bus error:", err)
      setSnackbar({
      open: true,
      message: '❌ Cập nhật xe buýt thất bại!',
      severity: 'error'
      });
    }
  }

  const handleOpenDelete = (bus) => setDeleteConfirm(bus)

  const handleDelete = async () => {
    if (!deleteConfirm) return
    try {
      await busAPI.delete(deleteConfirm._id)
      setBuses(buses.filter((b) => b._id !== deleteConfirm._id))
      setLastDeleteData({
        ...deleteConfirm,
      })
      //thong bao thanh cong
      setSnackbar({ open: true, message: 'Xóa xe buýt thành công!', severity: 'success' });
    } catch (err) {
      console.error("Delete bus error:", err)
      setSnackbar({ open: true, message: 'Xóa xe buýt thất bại!', severity: 'error' });
    } finally {
      setDeleteConfirm(null);
    }
  };

  const rows = buses.map((b) => ({
    id: b._id,
    licensePlate: b.licensePlate,
    capacity: b.capacity,
    currentStatus: b.currentStatus === "active" ? "Hoạt động"  : b.currentStatus === "maintenance" ? "Bảo trì" : "Ngừng hoạt động",
    driver: b.driver?.user?.username || "Chưa có",
    route: b.route?.name || "Chưa có",
    createdAt: new Date(b.createdAt).toLocaleDateString(),
    updatedAt: new Date(b.updatedAt).toLocaleDateString(),
  }))

  return (
    <Box sx={{ height: 500, width: "100%", p: 2 }}>
    <Stack direction="row" justifyContent="space-between" mb={2}>
      <h2>Quản lý xe buýt</h2>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleOpenForm()}
        sx={{
          background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
          color: "#fff",
          borderRadius: "12px",
          padding: "5px 20px",
          textTransform: "none",
          fontWeight: "600",
          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
          "&:hover": {
            background: "linear-gradient(135deg, #4338ca 0%, #2563eb 100%)",
            boxShadow: "0 6px 16px rgba(59, 130, 246, 0.45)",
          },
        }}
      >
        Thêm xe buýt
      </Button>
    </Stack>

    <BusTable
      rows={rows}
      buses={buses}
      paginationModel={paginationModel}
      setPaginationModel={setPaginationModel}
      onEdit={handleOpenForm}
      onDelete={handleOpenDelete}
    />

    <Dialog
      open={openForm}
      onClose={handleCloseForm}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
          color: "#fff",
          borderRadius: "4px 4px 0 0",
          fontWeight: 600,
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
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseForm} sx={{ color: "#555" }}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
              color: "#fff",
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(135deg, #4338ca 0%, #2563eb 100%)",
              },
            }}
          >
            {editingBus ? "Cập nhật" : "Thêm"}
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
    {/* Snackbar */}
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={() => setSnackbar({ ...snackbar, open: false })}    
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}     
    >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%',
            fontSize: "1rem",
            fontWeight: 500,
            borderRadius: 2,
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
           }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
  </Box>
  )
}