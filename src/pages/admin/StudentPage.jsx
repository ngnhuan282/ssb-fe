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
import AdminHeader from "../../components/admin/layout/AdminHeader";
import AdminSidebar from "../../components/admin/layout/AdminSidebar";
import {studentAPI} from "../../services/api";
import {parentAPI} from "../../services/api";
import {routeAPI} from "../../services/api";
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
      newErrors.pickupPoint = "Điểm đón là bắt buộc";
    if (!formData.dropoffPoint.trim())
      newErrors.dropoffPoint = "Điểm trả là bắt buộc";
    if (!formData.status) newErrors.status = "Trạng thái là bắt buộc";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      const cleanedData = {
        fullName: formData.fullName.trim(),
        age: Number(formData.age),
        class: formData.class.trim(),
        parent: formData.parent || null,
        route: formData.route || null,
        pickupPoint: formData.pickupPoint.trim(),
        dropoffPoint: formData.dropoffPoint.trim(),
        status: formData.status,
      };

      if (editingStudent) {
        const res = await studentAPI.update(editingStudent._id, cleanedData);
        setStudents(
          students.map((s) =>
            s._id === editingStudent._id ? res.data.data : s
          )
        );
      } else {
        const res = await studentAPI.create(cleanedData);
        setStudents([...students, res.data.data]);
      }
      handleCloseForm();
    } else {
      setErrors(newErrors);
    }
  };

  const handleOpenDelete = (student) => {
    setDeleteConfirm(student);
    setLastDeleteData(student);
  };

  const handleDelete = async (_id) => {
    await studentAPI.delete(_id);
    setStudents(students.filter((s) => s._id !== _id));
    setDeleteConfirm(null);
  };

  const rows = students.map((s) => ({
    id: s._id,
    fullName: s.fullName,
    age: s.age,
    class: s.class,
    parent: s.parent?._id || "Không có",
    route: s.route?.name || "Không có",
    pickupPoint: s.pickupPoint,
    dropoffPoint: s.dropoffPoint,
    status:
      s.status === "pending"
        ? "Đang đợi"
        : s.status === "picked_up"
        ? "Đã đón"
        : "Đã trả",
    createdAt: new Date(s.createdAt).toLocaleDateString(),
    updatedAt: new Date(s.updatedAt).toLocaleDateString(),
  }));

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f5f6fa" }}>
      <AdminHeader />
      <AdminSidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
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
    </Box>
  );
}
