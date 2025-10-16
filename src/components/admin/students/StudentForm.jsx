import React from "react";
import {
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

export default function StudentForm({ formData, errors, parents, routes, handleChange }) {
  return (
    <DialogContent dividers>
      <TextField
        name="fullName"
        label="Họ Tên"
        value={formData.fullName}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!errors.fullName}
        helperText={errors.fullName}
      />

      <TextField
        name="age"
        label="Tuổi"
        type="number"
        value={formData.age}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!errors.age}
        helperText={errors.age}
      />

      <TextField
        name="class"
        label="Lớp"
        value={formData.class}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!errors.class}
        helperText={errors.class}
      />

      <FormControl
        fullWidth
        margin="normal"
        error={!!errors.parent}
        variant="outlined"
        sx={{ "& .MuiInputBase-root": { backgroundColor: "#fff" } }}
      >
        <InputLabel>Phụ huynh</InputLabel>
        <Select name="parent" value={formData.parent || ""} onChange={handleChange} label="Phụ huynh">
          {parents.length > 0 ? (
            parents.map((p) => (
              <MenuItem key={p._id} value={p._id}>
                {p._id}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Không có dữ liệu</MenuItem>
          )}
        </Select>
        <FormHelperText>{errors.parent}</FormHelperText>
      </FormControl>

      <FormControl
        fullWidth
        margin="normal"
        error={!!errors.route}
        variant="outlined"
        sx={{ "& .MuiInputBase-root": { backgroundColor: "#fff" } }}
      >
        <InputLabel>Tuyến đường</InputLabel>
        <Select name="route" value={formData.route || ""} onChange={handleChange} label="Tuyến đường">
          {routes.length > 0 ? (
            routes.map((r) => (
              <MenuItem key={r._id} value={r._id}>
                {r.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Không có dữ liệu</MenuItem>
          )}
        </Select>
        <FormHelperText>{errors.route}</FormHelperText>
      </FormControl>

      <TextField
        name="pickupPoint"
        label="Điểm Đón"
        value={formData.pickupPoint}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!errors.pickupPoint}
        helperText={errors.pickupPoint}
      />

      <TextField
        name="dropoffPoint"
        label="Điểm Trả"
        value={formData.dropoffPoint}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!errors.dropoffPoint}
        helperText={errors.dropoffPoint}
      />

      <FormControl
        fullWidth
        margin="normal"
        error={!!errors.status}
        variant="outlined"
        sx={{ "& .MuiInputBase-root": { backgroundColor: "#fff" } }}
      >
        <InputLabel>Trạng thái</InputLabel>
        <Select name="status" value={formData.status} onChange={handleChange} label="Trạng thái">
          <MenuItem value="pending">Đang đợi</MenuItem>
          <MenuItem value="picked_up">Đã đón</MenuItem>
          <MenuItem value="dropped_off">Đã trả</MenuItem>
        </Select>
        <FormHelperText>{errors.status}</FormHelperText>
      </FormControl>
    </DialogContent>
  );
}
