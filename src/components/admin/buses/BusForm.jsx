import {
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

export default function BusForm({ formData, errors, drivers, routes, handleChange }) {
  return (
    <DialogContent dividers>
      <TextField
        name="licensePlate"
        label="Biển Số"
        value={formData.licensePlate}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!errors.licensePlate}
        helperText={errors.licensePlate}
      />

      <TextField
        name="capacity"
        label="Sức Chứa"
        type="number"
        value={formData.capacity}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!errors.capacity}
        helperText={errors.capacity}
      />

      <FormControl fullWidth margin="normal" error={!!errors.currentStatus}>
        <InputLabel>Trạng Thái</InputLabel>
        <Select
          name="currentStatus"
          value={formData.currentStatus}
          onChange={handleChange}
          label="Trạng Thái"
        >
          <MenuItem value="active">Hoạt động</MenuItem>
          <MenuItem value="maintenance">Bảo trì</MenuItem>
          <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
        </Select>
        <FormHelperText>{errors.currentStatus}</FormHelperText>
      </FormControl>

      <FormControl fullWidth margin="normal" error={!!errors.driver}>
        <InputLabel>Tài xế</InputLabel>
        <Select
          name="driver"
          value={formData.driver || ""}
          onChange={handleChange}
          label="Tài xế"
        >
          {drivers.length > 0 ? (
            drivers.map((driver) => (
              <MenuItem key={driver._id} value={driver._id}>
                {driver.licenseNumber || "Chưa có mã"}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Không có dữ liệu</MenuItem>
          )}
        </Select>
        <FormHelperText>{errors.driver}</FormHelperText>
      </FormControl>

      <FormControl fullWidth margin="normal" error={!!errors.route}>
        <InputLabel>Tuyến đường</InputLabel>
        <Select
          name="route"
          value={formData.route || ""}
          onChange={handleChange}
          label="Tuyến đường"
        >
          {routes.length > 0 ? (
            routes.map((route) => (
              <MenuItem key={route._id} value={route._id}>
                {route.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Không có dữ liệu</MenuItem>
          )}
        </Select>
        <FormHelperText>{errors.route}</FormHelperText>
      </FormControl>
    </DialogContent>
  );
}
