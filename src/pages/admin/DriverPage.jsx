import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  IconButton,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { driverAPI, busAPI } from "../../services/api"; // busAPI để fetch xe
import DriverTable from "../../components/admin/drivers/DriverTable";
import DriverForm from "../../components/admin/drivers/DriverForm";
import DriverDeleteDialog from "../../components/admin/drivers/DriverDeleteDialog";
import DriverDialog from "../../components/admin/drivers/DriverDialog";

export default function DriverPage() {
  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]); // thêm state lưu danh sách xe
  const [openForm, setOpenForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    licenseNumber: "",
    assignedBus: "",
    status: "active",

  });
  const [errors, setErrors] = useState({});

  // ===== Fetch drivers =====
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await driverAPI.getAll();
      
        const flatDrivers = res.data.data.map(driver => ({
          id: driver._id,
          _id: driver._id,
          fullName: driver.user?.username || "",
          phoneNumber: driver.user?.phone || "",
          email: driver.user?.email || "",
          licenseNumber: driver.licenseNumber || "",
          assignedBus: driver.assignedBus?.licensePlate || "",
          status: driver.status === "active" ? "Đang làm việc" : "Nghỉ",
          createdAt: driver.createdAt ? new Date(driver.createdAt).toLocaleDateString() : "",
          updatedAt: driver.updatedAt ? new Date(driver.updatedAt).toLocaleDateString() : "",
          user: driver.user,
        }));
        setDrivers(flatDrivers);
      } catch (err) {
        console.error("Fetch drivers error:", err);
      }
    };

    const fetchBuses = async () => {
      try {
        const res = await busAPI.getAll();
        setBuses(res.data.data);
      } catch (err) {
        console.error("Fetch buses error:", err);
      }
    };

    fetchDrivers();
    fetchBuses();
  }, []);

  // ===== Form Thêm/Sửa =====
  const handleOpenForm = (driver = null) => {

    if (driver) {
      setEditingDriver(driver);
      console.log("Editing driver:", driver);
      setFormData({
        fullName: driver.fullName,
        phoneNumber: driver.phoneNumber,
        email: driver.email,
        licenseNumber: driver.licenseNumber,
        assignedBus: driver.assignedBus?._id || "",
        status: driver.status === "Đang làm việc" ? "active" : "inactive",
      });
    } else {
      setEditingDriver(null);
      setFormData({
        fullName: "",
        phoneNumber: "",
        email: "",
        licenseNumber: "",
        assignedBus: "",
        status: "active",
      });
    }
    setErrors({});
    setOpenForm(true);
  };

  const handleCloseForm = () => setOpenForm(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Tên tài xế là bắt buộc";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Số điện thoại là bắt buộc";
    if (!/^\d{10,11}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "Số bằng lái là bắt buộc";
    if (!formData.assignedBus) newErrors.assignedBus = "Chọn xe đăng ký";
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
    let updatedDrivers;
    console.log("Submitting form data:", formData); // <-- log trước khi gửi
    if (editingDriver) {
      const res = await driverAPI.update(editingDriver._id, formData);
      updatedDrivers = drivers.map(d =>
        d._id === editingDriver._id ? { ...d, ...res.data.data } : d
      );
      console.log("Cập nhật tài xế thành công:", res.data.data); // <-- log khi update
    } else {
      console.log("Creating new driver with data:", formData); // <-- log dữ liệu gửi đi
      const res = await driverAPI.create(formData);
      console.log("Response from creating driver:", res.data.data); // <-- log toàn bộ response
      updatedDrivers = [...drivers, { ...res.data.data, 
        id: res.data.data._id,
        fullName: res.data.data.user?.username || "",
        assignedBus: res.data.data.assignedBus?.licensePlate || "",
        phoneNumber: res.data.data.user?.phone || "",
        email: res.data.data.user?.email || "",
        status: res.data.data.status === "active" ? "Đang làm việc" : "Nghỉ", 
        createdAt: res.data.data.createdAt ? new Date(res.data.data.createdAt).toLocaleDateString() : "",
        updatedAt: res.data.data.updatedAt ? new Date(res.data.data.updatedAt).toLocaleDateString() : "",
      }];
      console.log("Theem tài xế thành công:", res.data.data); // <-- log khi update
      console.log("con cac:", drivers); // <-- log khi update
    }
    console.log("Updated drivers list:", updatedDrivers); // <-- log danh sách tài xế sau khi cập nhật
    setDrivers(updatedDrivers);
    handleCloseForm();
  } catch (err) {
    console.error("Save driver error:", err);
    
  }
};


  return (
    <Box sx={{ p: 3, overflowY: "auto" }}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: "center", color: "#007bff" }}>
        Quản Lý Tài Xế
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 0 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
          sx={{ backgroundColor: "#007bff", "&:hover": { backgroundColor: "#0056b3" } }}
        >
          Thêm Tài Xế
        </Button>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={10}>
          <Typography variant="h6" sx={{ mb: 2 }}>Danh Sách Tài Xế</Typography>
          <DriverTable
            rows={drivers}
            onEdit={handleOpenForm}
          />
        </Grid>
      </Grid>

      {/* Dialog Thêm/Sửa */}
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: "#007bff", color: "#fff" }}>
          {editingDriver ? "Sửa Tài Xế" : "Thêm Tài Xế"}
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8, color: "#fff" }}
            onClick={handleCloseForm}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DriverForm
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            buses={buses} // truyền danh sách xe cho select
          />
          <DialogActions>
            <Button onClick={handleCloseForm}>Hủy</Button>
            <Button type="submit" variant="contained" sx={{ backgroundColor: "#007bff" }}>
              {editingDriver ? "Cập Nhật" : "Thêm"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <DriverDeleteDialog
        deleteConfirm={null} // giữ nguyên xóa
      />
      <DriverDialog
      open={openForm}
      onClose={handleCloseForm}
      formData={formData}
      onChange={handleChange}
      onSave={handleSubmit}   // Đây là form submit
      errors={errors}
      editing={!!editingDriver}
      buses={buses}
    />

    </Box>
  );
}
