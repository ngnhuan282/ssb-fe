// src/components/user/driver/IncidentReportForm.jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Grid,
  Alert,
} from '@mui/material';
import {
  Warning,
  LocalHospital,
  DirectionsCar,
  Traffic,
  LocalGasStation,
  Report,
  Send,
  PhotoCamera,
  MyLocation,
} from '@mui/icons-material';

const IncidentReportForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    type: '',
    severity: '',
    description: '',
    location: '',
    notifyParents: false,
    photos: [],
  });

  const incidentTypes = [
    { value: 'breakdown', label: 'Xe hỏng', icon: <DirectionsCar />, color: '#e74c3c' },
    { value: 'traffic', label: 'Kẹt xe', icon: <Traffic />, color: '#f39c12' },
    { value: 'fuel', label: 'Hết xăng', icon: <LocalGasStation />, color: '#e67e22' },
    { value: 'medical', label: 'Y tế', icon: <LocalHospital />, color: '#c0392b' },
    { value: 'emergency', label: 'Khẩn cấp', icon: <Warning />, color: '#8e44ad' },
    { value: 'other', label: 'Khác', icon: <Report />, color: '#95a5a6' },
  ];

  const severityLevels = [
    { value: 'low', label: 'Nhẹ', color: '#27ae60' },
    { value: 'medium', label: 'Trung bình', color: '#f39c12' },
    { value: 'high', label: 'Khẩn cấp', color: '#e74c3c' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData({
          ...formData,
          location: `${position.coords.latitude}, ${position.coords.longitude}`
        });
      });
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      photos: [...formData.photos, ...files]
    });
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#2c3e50' }}>
        📝 Báo cáo sự cố
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Quick Alert Buttons */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: '#7f8c8d' }}>
            Chọn nhanh loại sự cố:
          </Typography>
          <Grid container spacing={1}>
            {incidentTypes.map((type) => (
              <Grid item xs={6} sm={4} key={type.value}>
                <Button
                  fullWidth
                  variant={formData.type === type.value ? 'contained' : 'outlined'}
                  onClick={() => setFormData({ ...formData, type: type.value })}
                  startIcon={type.icon}
                  sx={{
                    textTransform: 'none',
                    py: 1.5,
                    borderColor: type.color,
                    color: formData.type === type.value ? '#fff' : type.color,
                    bgcolor: formData.type === type.value ? type.color : 'transparent',
                    '&:hover': {
                      borderColor: type.color,
                      bgcolor: formData.type === type.value ? type.color : `${type.color}20`,
                    },
                  }}
                >
                  {type.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Severity Level */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Mức độ nghiêm trọng</InputLabel>
          <Select
            value={formData.severity}
            onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
            label="Mức độ nghiêm trọng"
          >
            {severityLevels.map((level) => (
              <MenuItem key={level.value} value={level.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: level.color,
                    }}
                  />
                  {level.label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Description */}
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Mô tả chi tiết"
          placeholder="Nhập mô tả chi tiết về sự cố..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          sx={{ mb: 3 }}
          required
        />

        {/* Location */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Vị trí"
            placeholder="Nhập vị trí hoặc lấy GPS"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            InputProps={{
              endAdornment: (
                <Button
                  size="small"
                  startIcon={<MyLocation />}
                  onClick={handleGetLocation}
                  sx={{ textTransform: 'none' }}
                >
                  GPS
                </Button>
              ),
            }}
          />
        </Box>

        {/* Photo Upload */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<PhotoCamera />}
            sx={{ textTransform: 'none', mb: 1 }}
          >
            Đính kèm ảnh
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
            />
          </Button>
          {formData.photos.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {formData.photos.map((photo, index) => (
                <Chip
                  key={index}
                  label={photo.name}
                  onDelete={() => {
                    setFormData({
                      ...formData,
                      photos: formData.photos.filter((_, i) => i !== index)
                    });
                  }}
                  size="small"
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Notify Parents Checkbox */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <input
              type="checkbox"
              checked={formData.notifyParents}
              onChange={(e) => setFormData({ ...formData, notifyParents: e.target.checked })}
            />
            <Typography variant="body2">
              Gửi thông báo cho phụ huynh liên quan
            </Typography>
          </Box>
        </Alert>

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          startIcon={<Send />}
          disabled={!formData.type || !formData.severity || !formData.description}
          sx={{
            bgcolor: '#e74c3c',
            fontWeight: 600,
            py: 1.5,
            textTransform: 'none',
            fontSize: 16,
            '&:hover': {
              bgcolor: '#c0392b',
            },
            '&:disabled': {
              bgcolor: '#95a5a6',
            },
          }}
        >
          Gửi báo cáo khẩn cấp
        </Button>
      </form>
    </Paper>
  );
};

export default IncidentReportForm;