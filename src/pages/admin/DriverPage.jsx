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
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { driverAPI, busAPI } from "../../services/api"; // busAPI để fetch xe
import DriverTable from "../../components/admin/drivers/DriverTable";
// import DriverForm from "../../components/admin/drivers/DriverForm";
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
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ===== Fetch drivers =====
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await driverAPI.getAll();
        const [bus, user] = await Promise.all([
          busAPI.getAll(),
        ])
        setBuses(bus.data.data);

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

    // const fetchBuses = async () => {
    //   try {
    //     const res = await busAPI.getAll();
    //     setBuses(res.data.data);
    //   } catch (err) {
    //     console.error("Fetch buses error:", err);
    //   }
    // };

    fetchDrivers();
    // fetchBuses();
  }, []);

  // ===== Form Thêm/Sửa =====
  const handleOpenForm = (driver = null) => {

    if (driver) {
      setEditingDriver(driver);
      console.log('Driver', driver)
      const foundBus = buses.find(bus => bus.licensePlate === driver.assignedBus);
      console.log(editingDriver?.user)
      setFormData({
        user: driver?.user._id,
        fullName: driver.fullName,
        phoneNumber: driver.phoneNumber,
        email: driver.email,
        licenseNumber: driver.licenseNumber,
        assignedBus: foundBus._id || "",
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
    validateField(name, value);//kiem tra dinh dang ngay khi nguoi dung nhap
  };

  const handleDeleteClick = (driver) => {
    setDeleteConfirm(driver); // Mở dialog xác nhận xoá
  };


  // delete driver
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      console.log(deleteConfirm?.user)
      await driverAPI.delete(deleteConfirm._id, deleteConfirm?.user);

      setDrivers((prev) => prev.filter((d) => d._id !== deleteConfirm._id));
      // setLastDeleteData({ ...deleteConfirm });

      setSnackbar({
        open: true,
        message: 'Xóa tài xế thành công!',
        severity: 'success',
      });
    } catch (err) {
      console.error("❌ Delete driver error:", err);
      setSnackbar({
        open: true,
        message: 'Xóa tài xế thất bại!',
        severity: 'error',
      });
    } finally {
      setDeleteConfirm(null);
    }
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

  const validateField = (name, value) => {
    let message = "";

    switch (name) {
      case "fullName":
        if (!value.trim()) message = "Tên tài xế là bắt buộc";
        break;
      case "phoneNumber":
        if (!value.trim()) message = "Số điện thoại là bắt buộc";
        else if (!/^\d{10,11}$/.test(value)) message = "Số điện thoại không hợp lệ, 10 số nguyên dương";
        break;
      case "licenseNumber":
        if (!value.trim()) message = "Số bằng lái là bắt buộc";
        break;
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          message = "Email không hợp lệ";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }


    let updatedDrivers;
    console.log(editingDriver?.user)
    console.log("Submitting form data:", formData);
    if (editingDriver) {
      const payload = {
        ...formData,
        user: typeof formData.user === "object" ? formData.user._id : formData.user
      }
      const res = await driverAPI.update(editingDriver._id, payload);
      updatedDrivers = drivers.map(d =>
        d._id === editingDriver._id ? {
          ...d, ...res.data.data,
          id: res.data.data._id,
          fullName: res.data.data.user?.username || "",
          assignedBus: res.data.data.assignedBus?.licensePlate || "",
          phoneNumber: res.data.data.user?.phone || "",
          email: res.data.data.user?.email || "",
          status: res.data.data.status === "active" ? "Đang làm việc" : "Nghỉ",
          createdAt: res.data.data.createdAt ? new Date(res.data.data.createdAt).toLocaleDateString() : "",
          updatedAt: res.data.data.updatedAt ? new Date(res.data.data.updatedAt).toLocaleDateString() : "",
        } : d
      );
      setSnackbar({
        open: true,
        message: "Cập nhật tài xế thành công!",
        severity: "success",
      });
    } else {
      console.log("Creating new driver with data:", formData);
      const res = await driverAPI.create(formData);
      console.log("Response from creating driver:", res.data.data);
      updatedDrivers = [...drivers, {
        ...res.data.data,
        id: res.data.data._id,
        fullName: res.data.data.user?.username || "",
        assignedBus: res.data.data.assignedBus?.licensePlate || "",
        phoneNumber: res.data.data.user?.phone || "",
        email: res.data.data.user?.email || "",
        status: res.data.data.status === "active" ? "Đang làm việc" : "Nghỉ",
        createdAt: res.data.data.createdAt ? new Date(res.data.data.createdAt).toLocaleDateString() : "",
        updatedAt: res.data.data.updatedAt ? new Date(res.data.data.updatedAt).toLocaleDateString() : "",
      }];
      console.log("Updated drivers list:", updatedDrivers);
      setSnackbar({
        open: true,
        message: "Thêm tài xế thành công!",
        severity: "success",
      });
    }
    setDrivers(updatedDrivers);
    handleCloseForm();
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
            onDelete={handleDeleteClick}
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
          {/* <DriverForm
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            buses={buses} // truyền danh sách xe cho select
          /> */}
          <DialogActions>
            <Button onClick={handleCloseForm}>Hủy</Button>
            <Button type="submit" variant="contained" sx={{ backgroundColor: "#007bff" }}>
              {editingDriver ? "Cập Nhật" : "Thêm"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <DriverDeleteDialog
        deleteConfirm={deleteConfirm}
        onConfirm={handleDelete} // ✅ gọi hàm khi xác nhận
        onCancel={() => setDeleteConfirm(null)}
      />
      <DriverDialog
        open={openForm}
        onClose={handleCloseForm}
        formData={formData}
        onChange={handleChange}
        onSave={handleSubmit}
        onDelete={handleDeleteClick}
        errors={errors}
        editing={!!editingDriver}
        buses={buses}
      />

    </Box>
  );
}
