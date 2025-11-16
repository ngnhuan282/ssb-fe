// src/components/incidents/IncidentForm.jsx
import React, { useState } from 'react';
import {
  Box,
  Grid,
  FormControl,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
  Typography,
} from '@mui/material';
import { Description, LocationOn, Send } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import vi from 'date-fns/locale/vi';
import { notificationAPI } from "../../../services/api";

const IncidentForm = () => {
  const [incidentType, setIncidentType] = useState('');
  const [dateTime, setDateTime] = useState(new Date('2024-05-21T07:30:00'));
  const [location, setLocation] = useState('123 Đường ABC, Quận 1, TP.HCM');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);


const handleSubmit = async (isEmergency = false) => {
  try {
    const formData = new FormData();

    // append các field text
    formData.append("user", "6910388ff1c1fce244797451");
    formData.append("type", isEmergency ? "emergency" : "no_emergency");
    formData.append("message", description);
    formData.append("busId", "6910388ff1c1fce244797465");
    formData.append("scheduleId", "6910388ff1c1fce2447974cc");
    formData.append("read", "false");
    formData.append("location", location);
    formData.append("dateTime", dateTime.toISOString());
    formData.append("emergency_type", incidentType);

    // append file nếu có
    if (image) {
      formData.append("image", image);
    }

    console.log("FormData sending...");

    await notificationAPI.createIncident(formData);

    alert(isEmergency ? "Đã gửi báo cáo KHẨN CẤP!" : "Đã gửi báo cáo thường!");
  } catch (error) {
    console.error("Lỗi gửi sự cố:", error);
    alert("Không gửi được sự cố!");
  }
};


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };





  return (
    <Box
      component="form"
      noValidate
      sx={{
        p: { xs: 2, md: 4 },
        borderRadius: 3,
        border: '1px solid #e5e7eb',
        bgcolor: '#ffffff',
        boxShadow: 'none',
        maxWidth: 960,
        mx: 'auto',
      }}
    >
      {/* Loại sự cố */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: '#374151' }}>
          Loại sự cố
        </Typography>
        <Select
          value={incidentType}
          onChange={(e) => setIncidentType(e.target.value)}
          displayEmpty
          sx={{ 
            bgcolor: '#f9fafb', 
            borderRadius: 2, 
            '& fieldset': { border: '1px solid #e5e7eb' } 
          }}
        >
          <MenuItem value="" disabled>
            <em>Chọn loại sự cố</em>
          </MenuItem>
          <MenuItem value="Tai nạn">Tai nạn</MenuItem>
          <MenuItem value="Tắc đường">Tắc đường</MenuItem>
          <MenuItem value="Hỏng xe">Hỏng xe</MenuItem>
          <MenuItem value="Sự cố học sinh">Sự cố học sinh</MenuItem>
          <MenuItem value="Khác">Khác</MenuItem>
        </Select>
      </FormControl>

      {/* Thời gian và Địa điểm */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: '#374151' }}>
            Thời gian xảy ra
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <DateTimePicker
              value={dateTime}
              onChange={(newValue) => setDateTime(newValue)}
              ampm={false}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  sx={{ 
                    bgcolor: '#f9fafb', 
                    borderRadius: 2, 
                    '& fieldset': { border: '1px solid #e5e7eb' },
                    '& .MuiInputBase-input': { padding: '12px 14px' }
                  }} 
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: '#374151' }}>
            Địa điểm
          </Typography>
          <TextField
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            sx={{ 
              bgcolor: '#f9fafb', 
              borderRadius: 2, 
              '& fieldset': { border: '1px solid #e5e7eb' } 
            }}
            InputProps={{
              sx: { padding: '4px 14px' },
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn sx={{ color: '#9ca3af' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Mô tả chi tiết */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: '#374151' }}>
          Mô tả chi tiết
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Nhập mô tả chi tiết về sự cố..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ 
            bgcolor: '#f9fafb', 
            borderRadius: 2, 
            '& fieldset': { border: '1px solid #e5e7eb' } 
          }}
        />
      </FormControl>

      {/* Đính kèm hình ảnh */}
      <FormControl fullWidth sx={{ mb: 4 }}>
  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: '#374151' }}>
    Đính kèm hình ảnh
  </Typography>

  {/* Input file ẩn */}
  <input
    id="image-upload"
    type="file"
    accept="image/png, image/jpeg, image/jpg"
    style={{ display: 'none' }}
    onChange={handleFileChange}
  />

  {/* Khung upload */}
  <Box
    onClick={() => document.getElementById("image-upload").click()}
    sx={{
      border: '2px dashed #e5e7eb',
      borderRadius: 2,
      p: 4,
      bgcolor: '#f9fafb',
      textAlign: 'center',
      cursor: 'pointer',
      '&:hover': { borderColor: '#ef4444', bgcolor: '#fef2f2' },
    }}
  >
    {!preview ? (
      <>
        <Description sx={{ fontSize: 40, color: '#ef4444' }} />
        <Typography variant="body1" sx={{ color: '#6b7280', mt: 1 }}>
          <Typography component="span" sx={{ color: '#ef4444', fontWeight: 600 }}>
            Tải lên một tệp
          </Typography>
          {' '}hoặc kéo và thả
        </Typography>
        <Typography variant="caption" sx={{ color: '#9ca3af' }}>
          PNG, JPG lên đến 10MB
        </Typography>
      </>
    ) : (
      <Box>
        <img
          src={preview}
          alt="preview"
          style={{
            maxWidth: "100%",
            borderRadius: 10,
            maxHeight: 300,
            objectFit: "contain",
          }}
        />
        <Typography sx={{ mt: 1, color: '#6b7280' }}>
          Nhấn để chọn ảnh khác
        </Typography>
      </Box>
    )}
  </Box>
</FormControl>

      {/* Nút bấm */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => handleSubmit(false)}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            fontWeight: 600,
            color: '#4b5563',
            borderColor: '#d1d5db',
            bgcolor: '#ffffff',
            px: 3,
            py: 1,
            '&:hover': { bgcolor: '#f9fafb', borderColor: '#adb5bd' },
          }}
        >
          Gửi báo cáo
        </Button>
        <Button
          variant="contained"
          startIcon={<Send />}
          onClick={() => handleSubmit(true)}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            fontWeight: 600,
            bgcolor: '#ef4444',
            color: '#ffffff',
            px: 3,
            py: 1,
            '&:hover': { bgcolor: '#dc2626' },
          }}
        >
          Gửi báo cáo khẩn cấp
        </Button>
      </Box>
    </Box>
  );
};

export default IncidentForm;