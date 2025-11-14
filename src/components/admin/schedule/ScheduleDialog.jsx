// src/components/ScheduleDialog.jsx
import React from "react";
import {
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack,
    Typography,
    Box,
    Divider,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from "@mui/material";
import { motion } from "framer-motion";
import { Save, Close } from "@mui/icons-material";

export default function ScheduleDialog({
    open,
    form,
    editing,
    onChange,
    onClose,
    onSave,
    buses,
    routes,
    drivers,
    students,
    selectedStudents,
    onSelectStudents,
    errors
}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: 8,
                    overflow: "hidden",
                    backgroundColor: "#f9fafb",
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                    color: "white",
                    py: 2,
                    px: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="h6" fontWeight={600}>
                    {editing ? "Cập nhật lịch trình" : "Thêm lịch trình mới"}
                </Typography>
                <Button
                    onClick={onClose}
                    sx={{ color: "white", minWidth: "auto" }}
                    startIcon={<Close />}
                >
                    Đóng
                </Button>
            </Box>

            <DialogContent
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                sx={{ p: 3 }}
            >
                <Stack spacing={2}>
                    <FormControl fullWidth error={!!errors.bus}>
                        <InputLabel>Xe</InputLabel>
                        <Select
                            name="bus"
                            value={form.bus}
                            onChange={onChange}
                            label="Xe"
                        >
                            {buses.map((b) => (
                                <MenuItem key={b._id} value={b._id}>
                                    {b.licensePlate}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.bus && <Typography color="error" variant="body2">{errors.bus}</Typography>}
                    </FormControl>

                    <FormControl fullWidth error={!!errors.route}>
                        <InputLabel>Tuyến</InputLabel>
                        <Select
                            name="route"
                            value={form.route}
                            onChange={onChange}
                            label="Tuyến"
                            disabled={form.status === "in_progress" || form.status === "completed" || form.status === "delayed"}
                        >
                            {routes.map((r) => (
                                <MenuItem key={r._id} value={r._id}>
                                    {r.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.route && <Typography color="error" variant="body2">{errors.route}</Typography>}
                    </FormControl>

                    <FormControl fullWidth error={!!errors.driver}>
                        <InputLabel>Tài xế</InputLabel>
                        <Select
                            name="driver"
                            value={form.driver}
                            onChange={onChange}
                            label="Tài xế"
                        >
                            {drivers.map((d) => (
                                <MenuItem key={d._id} value={d._id}>
                                    {d.user?.username || d.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.driver && <Typography color="error" variant="body2">{errors.driver}</Typography>}
                    </FormControl>


                    <Divider sx={{ my: 1.5 }} />
                    <Stack direction="row" spacing={2}>
                        <TextField
                            label="Ngày"
                            name="date"
                            type="date"
                            value={form.date || ""}
                            onChange={onChange}
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.date}
                            helperText={errors.date}
                        />
                    </Stack>

                    <Stack direction="row" spacing={2}>
                        <TextField
                            label="Giờ bắt đầu"
                            name="starttime"
                            type="time"
                            value={form.starttime || ""}
                            onChange={onChange}
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.starttime}
                            helperText={errors.starttime}
                        />
                        <TextField
                            label="Giờ kết thúc"
                            name="endtime"
                            type="time"
                            value={form.endtime || ""}
                            onChange={onChange}
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.endtime}
                            helperText={errors.endtime}
                        />

                    </Stack>
                    <Button
                        variant="outlined"
                        onClick={onSelectStudents}
                        sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            py: 1.2,
                        }}
                        disabled={form.status === "in_progress" || form.status === "completed" || form.status === "delayed"}
                    >
                        Chọn học sinh ({selectedStudents.length})
                    </Button>
                    {errors.students && (
                        <Typography color="error" variant="body2" sx={{ mt: -1 }}>
                            {errors.students}
                        </Typography>
                    )}
                    <Box display="flex" gap={2}>
                        <TextField
                            label="Tần suất"
                            name="frequency"
                            select
                            value={form.frequency || ""}
                            onChange={onChange}
                            fullWidth
                            error={!!errors.frequency}
                            helperText={errors.frequency}
                        >
                            <MenuItem value="daily">Hàng ngày</MenuItem>
                            <MenuItem value="weekly">Hàng tuần</MenuItem>
                            <MenuItem value="monthly">Hàng tháng</MenuItem>
                        </TextField>

                        <TextField
                            label="Trạng thái"
                            name="status"
                            select
                            value={form.status || ""}
                            onChange={onChange}
                            fullWidth
                            error={!!errors.status}
                            helperText={errors.status}
                        >
                            <MenuItem value="scheduled">Đã lên lịch</MenuItem>
                            <MenuItem value="in_progress">Đang thực hiện</MenuItem>
                            <MenuItem value="completed">Hoàn thành</MenuItem>
                            <MenuItem value="delayed">Trì hoãn</MenuItem>
                        </TextField>
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                    startIcon={<Close />}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                    }}
                >
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    onClick={onSave}
                    startIcon={<Save />}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                        boxShadow: "0px 3px 6px rgba(25, 118, 210, 0.3)",
                        "&:hover": {
                            background: "linear-gradient(135deg, #1565c0, #1e88e5)",
                        },
                    }}
                >
                    Lưu
                </Button>
            </DialogActions>
        </Dialog >
    );
}
