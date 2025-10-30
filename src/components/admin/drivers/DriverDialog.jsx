// src/components/admin/drivers/DriverDialog.jsx
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
  FormControl,
  IconButton,
} from "@mui/material";
import { Save, Close } from "@mui/icons-material";

export default function DriverDialog({
  open,
  formData,
  editing,
  onChange,
  onClose,
  onSave,
  buses,
  errors,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, boxShadow: 8, overflow: "hidden", backgroundColor: "#f9fafb" },
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
          {editing ? "Cập nhật tài xế" : "Thêm tài xế mới"}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="Họ và tên"
            name="fullName"
            value={formData.fullName || ""}
            onChange={onChange}
            fullWidth
            error={!!errors.fullName}
            helperText={errors.fullName}
          />

          <TextField
            label="Số điện thoại"
            name="phoneNumber"
            value={formData.phoneNumber || ""}
            onChange={onChange}
            onBlur={(e) => validateField(e.target.name, e.target.value)}
            fullWidth
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
          />

          <TextField
            label="Địa chỉ email"
            name="email"
            value={formData.email || ""}
            onChange={onChange}
            fullWidth
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            label="Mật khẩu"
            type="password"
            name="password"
            margin="dense"
            value={formData.password || ""}
            onChange={onChange}
            fullWidth
            error={!!errors.password}
            helperText={errors.password}
          />

          <TextField
            label="Số bằng lái"
            name="licenseNumber"
            value={formData.licenseNumber || ""}
            onChange={onChange}
            fullWidth
            error={!!errors.licenseNumber}
            helperText={errors.licenseNumber}
          />

          <FormControl fullWidth error={!!errors.assignedBus}>
            <InputLabel>Xe đăng ký</InputLabel>
            <Select
              name="assignedBus"
              value={formData.assignedBus || ""}
              onChange={onChange}
              label="Xe đăng ký"
            >
              {buses.map((bus) => (
                <MenuItem key={bus._id} value={bus._id}>
                  {bus.licensePlate}
                </MenuItem>
              ))}
            </Select>
            {errors.assignedBus && (
              <Typography color="error" variant="body2">
                {errors.assignedBus}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth error={!!errors.status}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              name="status"
              value={formData.status || "active"}
              onChange={onChange}
              label="Trạng thái"
            >
              <MenuItem value="active">Đang làm việc</MenuItem>
              <MenuItem value="inactive">Nghỉ</MenuItem>
            </Select>
            {errors.status && (
              <Typography color="error" variant="body2">
                {errors.status}
              </Typography>
            )}
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit" startIcon={<Close />}>
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          startIcon={<Save />}
          sx={{
            background: "linear-gradient(135deg, #1976d2, #42a5f5)",
            "&:hover": { background: "linear-gradient(135deg, #1565c0, #1e88e5)" },
          }}
        >
          {editing ? "Cập nhật" : "Thêm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
