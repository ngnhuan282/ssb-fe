// src/components/ScheduleManager.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Stack, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import ScheduleTable from "./ScheduleTable";
import ScheduleDialog from "./ScheduleDialog";
import StudentSelectDialog from "./StudentSelectDialog";
import moment from "moment-timezone";
import { scheduleAPI } from "../../../services/api";
import { busAPI } from "../../../services/api";
import { routeAPI } from "../../../services/api";
import { driverAPI } from "../../../services/api";
import { studentAPI } from "../../../services/api";
import { userAPI } from "../../../services/api";


export default function ScheduleManager() {
    const [schedules, setSchedules] = useState([]);
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [students, setStudents] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [studentDialogOpen, setStudentDialogOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
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
        nestudent: 0,
    });


    useEffect(() => {
        fetchApiData();
    }, []);

    const fetchApiData = async () => {
        try {
            const [schedule, bus, route, driver, student, user] = await Promise.all([
                scheduleAPI.getAll(),
                busAPI.getAll(),
                routeAPI.getAll(),
                driverAPI.getAll(),
                studentAPI.getAll(),
                userAPI.getAll(),
            ]);

            console.log("Fetched buses:", bus.data.data);
            console.log("Fetched routes:", route.data.data);
            console.log("Fetched drivers:", driver.data.data);
            console.log("Fetched students:", student.data.data);

            setBuses(bus.data.data)
            setRoutes(route.data.data)
            setDrivers(driver.data.data)
            setStudents(student.data.data)
            setUsers(user.data.data)


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
            }));
            console.log("Fetched schedules:", formatted);
            setSchedules(formatted);
        } catch (error) {
            console.error("Error fetching schedules:", error);
        }
    };


    const handleOpen = (row = null) => {
        if (row) {
            setEditing("rowww", row._id);

            const foundBus = buses.find(b => b.licensePlate === row.bus);
            const foundUserId = drivers.find(d => d.user === row.driver);
            const foundDriver = users.find(u => u.username === foundUserId);
            const foundRoute = routes.find(r => r.name === row.route);

            console.log(row)
            setForm({
                route: foundRoute?._id || "",
                bus: foundBus?._id || "",
                driver: foundDriver?._id || "",
                date: moment(row.date, ["DD-MM-YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD"),
                starttime: row.starttime || "",
                endtime: row.endtime || "",
                frequency: row.frequency || "daily",
                status: row.status || "scheduled",
                numstudent: row.numstudent || "",
            });
        } else {
            setEditing(null);
            setForm({
                route: "",
                bus: "",
                driver: "",
                date: "",
                starttime: "",
                endtime: "",
            });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
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
            await axios.put(`http://localhost:5000/api/v1/schedules/${editing}`, payload);
        } else {
            await axios.post("http://localhost:5000/api/v1/schedules", payload);
        }

        await fetchApiData(); // làm mới danh sách
        setOpen(false);
    };


    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa lịch trình này?")) {
            await axios.delete(`http://localhost:5000/api/v1/schedules/${id}`);
            setSchedules((prev) => prev.filter((s) => s._id !== id));
        }
    };

    return (
        <Box sx={{ height: 500, width: "100%", p: 2 }}>
            <Stack direction="row" justifyContent="space-between" mb={2}>
                <h2>Quản lý lịch trình</h2>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleOpen}
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
                onDelete={handleDelete}
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
        </Box>
    );
}
