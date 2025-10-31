import {
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  Stack,
} from "@mui/material";
import moment from "moment-timezone";

export default function RouteForm({ formData, errors, buses, handleChange, addStop, removeStop, handleStopChange }) {
  return (
    <DialogContent dividers>
      <TextField
        name="name"
        label="Tên Tuyến Đường"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!errors.name}
        helperText={errors.name}
      />

      <TextField
        name="distance"
        label="Quãng Đường (km)"
        type="number"
        value={formData.distance}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!errors.distance}
        helperText={errors.distance}
      />

      <TextField
        name="estimatedTime"
        label="Thời Gian Dự Kiến (phút)"
        type="number"
        value={formData.estimatedTime}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!errors.estimatedTime}
        helperText={errors.estimatedTime}
      />

       <FormControl fullWidth margin="normal" error={!!errors.assignedBus}>
        <InputLabel>Xe phụ trách</InputLabel>
        <Select
          name="assignedBus"
          value={formData.assignedBus || ""}
          onChange={handleChange}
          label="Xe Phụ Trách"
        >
          {buses.length > 0 ? (
            buses.map((bus) => (
              <MenuItem key={bus._id} value={bus._id}>
                {bus.licensePlate}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Không có dữ liệu</MenuItem>
          )}
        </Select>
        <FormHelperText>{errors.assignedBus}</FormHelperText>
      </FormControl>

      <h4 style={{ marginTop: "1rem" }}>Điểm dừng</h4>
      {errors.stops && (
        <FormHelperText
          error
          sx={{ ml: 1, mb: 1, fontSize: "0.9rem", color: "#d32f2f" }}
        >
          {errors.stops}
        </FormHelperText>
      )}
      {formData.stops.map((stop, index) => (
        <Stack 
        key={index} 
        direction="row" 
        spacing={2} 
        alignItems="center"
        sx={{ mt: 1 }}
        >
          <TextField
            label="Vị trí"
            value={stop.location}
            onChange={(e) => handleStopChange(index, "location", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Thời gian"
            type="datetime-local"
            value={stop.time ? moment(stop.time).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DDTHH:mm") : ""}
            onChange={(e) => handleStopChange(index, "time", e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <Button color="error" onClick={() => removeStop(index)}>Xóa</Button>          
        </Stack>
      ))}
      <Button
        onClick={addStop}
        variant="outlined"
        sx={{ mt: 1}}
      >
        Thêm điểm dừng
      </Button>
      </DialogContent>
  )
}