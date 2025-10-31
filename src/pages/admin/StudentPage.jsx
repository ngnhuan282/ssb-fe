import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { studentAPI } from "../../services/api";
import { parentAPI } from "../../services/api";
import { routeAPI } from "../../services/api";
import StudentTable from "../../components/admin/students/StudentTable";
import StudentForm from "../../components/admin/students/StudentForm";
import StudentDeleteDialog from "../../components/admin/students/StudentDeleteDialog";
import Notification from "../../components/admin/layout/AdminNotification";

export default function StudentPage() {
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    class: "",
    parent: "",
    route: "",
    pickupPoint: "",
    dropoffPoint: "",
    status: "pending",
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [studentRes, parentRes, routeRes] = await Promise.all([
          studentAPI.getAll(),
          parentAPI.getAll(),
          routeAPI.getAll(),
        ]);

        console.log("Students :", studentRes.data.data)
        console.log("Parents :", parentRes.data.data)

        setStudents(studentRes.data.data);
        setParents(parentRes.data.data);
        setRoutes(routeRes.data.data);
      } catch (err) {
        console.error("Fetch students error:", err);
      }
    };
    fetchAll();
  }, []);

  const showNotification = (message, type = "success") => {
    setSnackbar({ open: true, message, type });
  };

  const handleCloseNotification = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenForm = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        fullName: student.fullName || "",
        age: student.age || "",
        class: student.class || "",
        parent: student.parent?._id || "",
        route: student.route?._id || "",
        pickupPoint: student.pickupPoint || "",
        dropoffPoint: student.dropoffPoint || "",
        status: student.status || "pending",
      });
    } else {
      setEditingStudent(null);
      setFormData({
        fullName: "",
        age: "",
        class: "",
        parent: "",
        route: "",
        pickupPoint: "",
        dropoffPoint: "",
        status: "pending",
      });
    }
    setErrors({});
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingStudent(null);
    setFormData({
      fullName: "",
      age: "",
      class: "",
      parent: "",
      route: "",
      pickupPoint: "",
      dropoffPoint: "",
      status: "pending",
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Tên học sinh là bắt buộc";
    if (!formData.age || isNaN(formData.age) || Number(formData.age) < 3)
      newErrors.age = "Tuổi phải là số và tối thiểu 3";
    if (!formData.class.trim()) newErrors.class = "Lớp là bắt buộc";
    if (!formData.parent) newErrors.parent = "Vui lòng chọn phụ huynh";
    if (!formData.route) newErrors.route = "Vui lòng chọn tuyến đường";
    if (!formData.pickupPoint.trim())
      newErrors.pickupPoint = "Vui lòng nhập điểm đón";
    if (!formData.dropoffPoint.trim())
      newErrors.dropoffPoint = "Vui lòng nhập điểm trả";
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
      let updatedStudents;
      if (editingStudent) {
        console.log("Form data gửi lên:", formData);
        const res = await studentAPI.update(editingStudent._id, formData);
        updatedStudents = students.map((s) =>
          s._id === editingStudent._id ? res.data.data : s
        );
      } else {
        const res = await studentAPI.create(formData);
        updatedStudents = [...students, res.data.data];
      }
      setStudents(updatedStudents);
      handleCloseForm();
      //snackbar
      if (editingStudent) {
        showNotification('Cập nhật học sinh thành công!', 'success')
      } else {
        showNotification('Thêm học sinh thành công!', 'success')
      }
    } catch (err) {
      console.error("Save student error:", err);
      showNotification('Lưu thông tin xe buýt thất bại !')
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await studentAPI.delete(deleteConfirm._id);
      setStudents(students.filter((s) => s._id !== deleteConfirm._id));
      showNotification('Xóa học sinh thành công!', 'success')
    } catch (err) {
      console.error("Delete student error:", err);
      showNotification('Xóa học sinh thất bại!', 'error')
    } finally {
      setDeleteConfirm(null);
    }
  };

  const rows = students.map((s) => ({
    id: s._id,
    fullName: s.fullName,
    age: s.age,
    class: s.class,
    parent: s.parent?.user?.username || "Chưa có",
    route: s.route?.name || "Chưa có",
    pickupPoint: s.pickupPoint,
    dropoffPoint: s.dropoffPoint,
    status: s.status === "pending" ? "Chờ đợi" : s.status === "picked_up" ? "Đã đón" : "Đã trả",
    createdAt: new Date(s.createdAt).toLocaleDateString(),
    updatedAt: new Date(s.updatedAt).toLocaleDateString(),
  }));

  return (
    <Box sx={{ height: 500, width: "100%", p: 2 }}>
      <Stack direction="row" justifyContent="space-between" mb={2} alignItems="center">
        <h2>Quản lý học sinh</h2>
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
          Thêm học sinh
        </Button>
      </Stack>

      <StudentTable
        rows={rows}
        students={students}
        onEdit={handleOpenForm}
        onDelete={setDeleteConfirm}
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
          {editingStudent ? "Sửa học sinh" : "Thêm học sinh"}
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8, color: "#fff" }}
            onClick={handleCloseForm}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <StudentForm
            formData={formData}
            errors={errors}
            parents={parents}
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
              {editingStudent ? "Cập nhật" : "Thêm"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <StudentDeleteDialog
        deleteConfirm={deleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
      />

      <Notification
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={handleCloseNotification}
      />
    </Box>
  );
}