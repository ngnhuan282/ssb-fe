import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { studentAPI } from "../../services/api";
import { parentAPI } from "../../services/api";
import { routeAPI } from "../../services/api";
import StudentTable from "../../components/admin/students/StudentTable";
import StudentForm from "../../components/admin/students/StudentForm";
import StudentDeleteDialog from "../../components/admin/students/StudentDeleteDialog";

export default function StudentPage() {
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [lastDeleteData, setLastDeleteData] = useState(null);
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
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [studentRes, parentRes, routeRes] = await Promise.all([
          studentAPI.getAll(),
          parentAPI.getAll(),
          routeAPI.getAll(),
        ]);
        setStudents(studentRes.data.data);
        setParents(parentRes.data.data);
        setRoutes(routeRes.data.data);
      } catch (err) {
        console.error("Fetch students error:", err);
      }
    };
    fetchAll();
  }, []);

  const handleOpenForm = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        ...student,
        parent: student.parent?._id || "",
        route: student.route?._id || "",
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

  const handleCloseForm = () => setOpenForm(false);

  const handleFormExited = () => {
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
    } catch (err) {
      console.error("Save student error:", err);
    }
  };

  const handleOpenDelete = (student) => setDeleteConfirm(student);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await studentAPI.delete(deleteConfirm._id);
      const updated = students.filter((s) => s._id !== deleteConfirm._id);
      setStudents(updated);
      setLastDeleteData({
        ...deleteConfirm,
        deletedAt: new Date().toLocaleString(),
      });
    } catch (err) {
      console.error("Delete student error:", err);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const rows = students.map((s) => ({
    id: s._id,
    fullName: s.fullName,
    age: s.age,
    class: s.class,
    parent: s.parent?.fullName || "Chưa có",
    route: s.route?.name || "Chưa có",
    pickupPoint: s.pickupPoint,
    dropoffPoint: s.dropoffPoint,
    status: s.status === "pending"
      ? "Chờ đợi"
      : s.status === "picked_up"
      ? "Đã đón"
      : "Đã trả",
    createdAt: new Date(s.createdAt).toLocaleDateString(),
    updatedAt: new Date(s.updatedAt).toLocaleDateString(),
  }));

  return (
    <Box sx={{ p: 3, overflowY: "auto" }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ textAlign: "center", color: "#007bff" }}
      >
        Quản Lý Học Sinh
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
          Thêm Học Sinh
        </Button>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={10}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: "#333" }}>
                Danh Sách Học Sinh
              </Typography>

              <StudentTable
                rows={rows}
                students={students}
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
                onEdit={handleOpenForm}
                onDelete={handleOpenDelete}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
          {editingStudent ? "Sửa Học Sinh" : "Thêm Học Sinh"}
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
          <DialogActions>
            <Button onClick={handleCloseForm}>Hủy</Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#007bff",
                "&:hover": { backgroundColor: "#0056b3" },
              }}
            >
              {editingStudent ? "Cập Nhật" : "Thêm"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <StudentDeleteDialog
        deleteConfirm={deleteConfirm}
        lastDeleteData={lastDeleteData}
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}