import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Stack,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Edit, Delete } from "@mui/icons-material";

export default function ScheduleManager() {
    const [schedules, setSchedules] = useState();

    useEffect(() => {
        fetchApiData();
    }, []);

    const fetchApiData = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/v1/schedules");
            const data = await res.json();
            setSchedules(data);
        } catch (error) {
            console.error("Error fetching schedules:", error);
        }
    }

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        route: "",
        bus: "",
        driver: "",
        date: "",
        startTime: "",
        endTime: "",
    });

    const handleOpen = (row = null) => {
        if (row) {
            setEditing(row.id);
            setForm(row);
        } else {
            setEditing(null);
            setForm({
                route: "",
                bus: "",
                driver: "",
                date: "",
                startTime: "",
                endTime: "",
            });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (editing) {
            // Cập nhật
            setSchedules((prev) =>
                prev.map((s) => (s.id === editing ? { ...form, id: editing } : s))
            );
        } else {
            // Thêm mới
            setSchedules((prev) => [...prev, { ...form, id: Date.now() }]);
        }
        setOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa lịch trình này?")) {
            setSchedules((prev) => prev.filter((s) => s.id !== id));
        }
    };

    const columns = [
        { field: "route", headerName: "Tuyến", flex: 1 },
        { field: "bus", headerName: "Xe", flex: 1 },
        { field: "driver", headerName: "Tài xế", flex: 1 },
        { field: "date", headerName: "Ngày", flex: 1 },
        { field: "startTime", headerName: "Bắt đầu", flex: 1 },
        { field: "endTime", headerName: "Kết thúc", flex: 1 },
        {
            field: "actions",
            headerName: "Thao tác",
            flex: 1,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <Button
                        size="small"
                        color="primary"
                        variant="outlined"
                        onClick={() => handleOpen(params.row)}
                        startIcon={<Edit />}
                    >
                        Sửa
                    </Button>
                    <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => handleDelete(params.row.id)}
                        startIcon={<Delete />}
                    >
                        Xóa
                    </Button>
                </Stack>
            ),
        },
    ];

    return (
        <Box sx={{ height: 500, width: "100%", p: 2 }}>
            <Stack direction="row" justifyContent="space-between" mb={2}>
                <h2>Quản lý lịch trình</h2>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => handleOpen()}
                >
                    Thêm lịch trình
                </Button>
            </Stack>

            <DataGrid
                rows={schedules}
                columns={columns}
                pageSize={5}
                disableRowSelectionOnClick
                sx={{ backgroundColor: "white" }}
            />

            {/* Dialog thêm/sửa */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {editing ? "Cập nhật lịch trình" : "Thêm lịch trình mới"}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Tuyến"
                            name="route"
                            value={form.route}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Xe"
                            name="bus"
                            value={form.bus}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Tài xế"
                            name="driver"
                            value={form.driver}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Ngày"
                            name="date"
                            type="date"
                            value={form.date}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Bắt đầu"
                                name="startTime"
                                type="time"
                                value={form.startTime}
                                onChange={handleChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="Kết thúc"
                                name="endTime"
                                type="time"
                                value={form.endTime}
                                onChange={handleChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button variant="contained" onClick={handleSave}>
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
