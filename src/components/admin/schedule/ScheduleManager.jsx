// src/components/ScheduleManager.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Stack, Button, Dialog, DialogTitle, DialogContent, TableContainer, TableBody, TableCell, TableHead, TableRow, Paper, Table, IconButton } from "@mui/material";
import { Add } from "@mui/icons-material";
import ScheduleTable from "./ScheduleTable";
import ScheduleDialog from "./ScheduleDialog";
import StudentSelectDialog from "./StudentSelectDialog";
import ScheduleDeleteDialog from "./ScheduleDeleteDialog";
import Notification from "../layout/AdminNotification";
import moment from "moment-timezone";
import { scheduleAPI } from "../../../services/api";
import { busAPI } from "../../../services/api";
import { routeAPI } from "../../../services/api";
import { driverAPI } from "../../../services/api";
import { studentAPI } from "../../../services/api";



export default function ScheduleManager() {
    const [schedules, setSchedules] = useState([]);
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [studentDialogOpen, setStudentDialogOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [errors, setErrors] = useState({});
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [notify, setNotify] = useState({
        open: false,
        message: "",
        type: "success",
    });
    const [form, setForm] = useState({
        route: "",
        bus: "",
        driver: "",
        date: "",
        starttime: "",
        endtime: "",
        frequency: "",
        status: "",
        students: [],
        numstudent: 0,
    });

    const [studentListOpen, setStudentListOpen] = useState(false);
    const [currentStudents, setCurrentStudents] = useState([]);

    const handleViewStudents = (row) => {
        const rowStudent = row.students.map(sid => {
            const student = students.find(st => st._id === sid);
            return student || { fullName: "Không rõ" };
        });
        console.log("studentrow:", rowStudent)
        setCurrentStudents(rowStudent || []);
        setStudentListOpen(true);
    };

    const showNotification = (message, type = "success") => {
        setNotify({ open: true, message, type });
    };

    const handleCloseNotification = () => {
        setNotify({ ...notify, open: false });
    };


    useEffect(() => {
        fetchApiData();
    }, []);

    const fetchApiData = async () => {
        try {
            setEditing(null)
            const [schedule, bus, route, driver, student] = await Promise.all([
                scheduleAPI.getAll(),
                busAPI.getAll(),
                routeAPI.getAll(),
                driverAPI.getAll(),
                studentAPI.getAll(),
            ]);
            setBuses(bus.data.data)
            setRoutes(route.data.data)
            setDrivers(driver.data.data)
            setStudents(student.data.data)

            const formatted = schedule.data.data.map((item) => ({
                ...item,
                bus: item.bus?.licensePlate || "",
                driver: item.driver?.user?.username || "",
                route: item.route?.name || "",
                date: item.date
                    ? moment(item.date).tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY")
                    : "",
                starttime: item.starttime
                    ? moment(item.starttime).tz("Asia/Ho_Chi_Minh").format("HH:mm")
                    : "",
                endtime: item.endtime
                    ? moment(item.endtime).tz("Asia/Ho_Chi_Minh").format("HH:mm")
                    : "",
                frequency: item.frequency === 'daily' ? 'Hàng ngày' : item.frequency === 'weekly' ? 'Hàng tuần' : 'Hàng tháng',
                status: item.status === 'scheduled' ? 'Đã lên lịch' : item.status === 'in_progress' ? 'Đang tiến hành' : item.status === 'completed' ? 'Hoàn thành' : 'Bị trì hoãn',
                createdAt: item.createdAt
                    ? moment(item.createdAt).tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY HH:mm")
                    : "",
                updatedAt: item.updatedAt
                    ? moment(item.updatedAt).tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY HH:mm")
                    : "",
                onViewStudents: (row) => handleViewStudents(row),
            }));
            setSchedules(formatted);
        } catch (error) {
            console.error("Error fetching schedules:", error);
            showNotification("Xảy ra lỗi khi lấy dữ liệu !", "success");
        }
    };


    const handleOpen = async (row = null) => {
        if (row) {
            setEditing(row._id);

            const rowData = await scheduleAPI.getById(row._id)

            const foundBus = buses.find(b => b.licensePlate === row.bus);
            const foundDriver = drivers.find(d => d.user.username === row.driver);
            const foundRoute = routes.find(r => r.name === row.route);
            console.log(rowData)
            setForm({
                route: foundRoute?._id || "",
                bus: foundBus?._id || "",
                driver: foundDriver?._id || "",
                date: moment(row.date, ["DD-MM-YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD"),
                starttime: row.starttime || "",
                endtime: row.endtime || "",
                frequency: rowData.data.data.frequency || "",
                status: rowData.data.data.status || "",
                students: rowData.data.data.students || [],

            });

            setSelectedStudents(rowData.data.data.students || []);
        } else {
            setEditing(null);
            setForm({
                route: "",
                bus: "",
                driver: "",
                date: "",
                starttime: "",
                endtime: "",
                frequency: "",
                status: "",
                students: [],
            });
            setSelectedStudents([])
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setErrors({});
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!validateForm(form)) return;

        const payload = {
            route: form.route,
            bus: form.bus,
            driver: form.driver,
            date: moment(form.date).toISOString(),
            starttime: moment(`${form.date} ${form.starttime}`, "DD-MM-YYYY HH:mm").toISOString(),
            endtime: moment(`${form.date} ${form.endtime}`, "DD-MM-YYYY HH:mm").toISOString(),
            frequency: form.frequency,
            students: selectedStudents,
            numstudent: selectedStudents.length,
            status: form.status,
        };

        console.log("Payload to save:", payload);

        if (editing) {
            await scheduleAPI.update(editing, payload)
            showNotification("Thêm lịch trình thành công", "success");
        } else {
            await scheduleAPI.create(payload)
            showNotification("Cập nhật lịch trình thành công", "success");
        }

        await fetchApiData(); // làm mới danh sách
        setSelectedStudents([]);
        setErrors({})
        setOpen(false);
    };

    const handleOpenDelete = (scheduleId) => setDeleteConfirm(scheduleId);

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        await scheduleAPI.delete(deleteConfirm);
        setSchedules((prev) => prev.filter((s) => s._id !== deleteConfirm));
        setDeleteConfirm(null);
        showNotification("Xóa lịch trình thành công", "success");
    };

    const validateForm = (form) => {
        const newErrors = {};

        console.log(form)

        if (!form.route) newErrors.route = "Vui lòng chọn tuyến đường.";
        if (!form.bus) newErrors.bus = "Vui lòng chọn xe buýt.";
        if (!form.driver) newErrors.driver = "Vui lòng chọn tài xế.";

        if (!form.date) newErrors.date = "Vui lòng chọn ngày.";
        else if (isNaN(new Date(form.date).getTime()))
            newErrors.date = "Ngày không hợp lệ.";

        if (!form.starttime) newErrors.starttime = "Vui lòng nhập giờ bắt đầu.";
        if (!form.endtime) newErrors.endtime = "Vui lòng nhập giờ kết thúc.";
        else if (form.starttime && form.endtime <= form.starttime)
            newErrors.endtime = "Giờ kết thúc phải sau giờ bắt đầu.";

        if (!form.frequency) newErrors.frequency = "Vui lòng chọn tần suất.";
        if (!form.status) newErrors.status = "Vui lòng chọn trạng thái";
        if (!selectedStudents || selectedStudents.length === 0)
            newErrors.students = "Phải chọn ít nhất một học sinh.";

        console.log("errors:", newErrors);


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    return (
        <Box sx={{ height: 500, width: "100%", p: 2 }}>
            <Stack direction="row" justifyContent="space-between" mb={2}>
                <h2>Quản lý lịch trình</h2>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<Add sx={{ fontSize: 18 }} />}
                    onClick={() => handleOpen(null)}
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
                    Thêm lịch trình
                </Button>



            </Stack>

            <ScheduleTable
                schedules={schedules}
                onEdit={handleOpen}
                onDelete={handleOpenDelete}
                onViewStudents={handleViewStudents}
            />

            <ScheduleDialog
                open={open}
                form={form}
                editing={editing}
                onChange={handleChange}
                onClose={handleClose}
                onSave={handleSave}
                buses={buses}
                routes={routes}
                drivers={drivers}
                students={students}
                selectedStudents={selectedStudents}
                onSelectStudents={() => setStudentDialogOpen(true)}
                errors={errors}
            />
            <StudentSelectDialog
                open={studentDialogOpen}
                students={students}
                selectedStudents={selectedStudents}
                onToggleStudent={(id) =>
                    setSelectedStudents((prev) =>
                        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                    )
                }
                onClose={() => setStudentDialogOpen(false)}
            />

            <ScheduleDeleteDialog
                deleteConfirm={deleteConfirm}
                onCancel={() => setDeleteConfirm(null)}
                onConfirm={handleDelete}
            />
            <Notification
                open={notify.open}
                message={notify.message}
                type={notify.type}
                onClose={handleCloseNotification}
            />

            <Dialog open={studentListOpen} onClose={() => setStudentListOpen(false)} fullWidth
                maxWidth="md">
                <DialogTitle>Danh sách học sinh</DialogTitle>
                <DialogContent>
                    {currentStudents.length > 0 ? (
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="a dense table">
                                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableRow>
                                        <TableCell component="th" scope="row">Tên</TableCell>
                                        <TableCell align="center">Lớp</TableCell>
                                        <TableCell align="right">Điểm đón</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentStudents.map((student, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb",
                                            }}
                                        >
                                            <TableCell component="th" scope="row">{student.fullName}</TableCell>
                                            <TableCell align="center">{student.class}</TableCell>
                                            <TableCell align="right">{student.pickupPoint}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <p>Không có học sinh nào trong lịch trình này.</p>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
}
