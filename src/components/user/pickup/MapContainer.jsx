// src/components/driver/pickup/MapContainer.jsx
import React from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  Typography, // <--- ĐÃ THÊM VÀO
} from '@mui/material';
import { Search } from '@mui/icons-material';

const MapContainer = () => {
  return (
    <Box
      sx={{
        flex: 1,
        height: '100vh',
        position: 'relative',
        bgcolor: '#e5e7eb', // Màu nền placeholder cho map
      }}
    >
      {/* Thanh tìm kiếm */}
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          top: 24,
          left: 24,
          zIndex: 10,
          borderRadius: 3,
        }}
      >
        <TextField
          placeholder="Search for a location"
          variant="outlined"
          sx={{
            width: 350,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: '#ffffff',
              '& fieldset': {
                border: 'none',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#9ca3af' }} />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Placeholder cho bản đồ */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9ca3af',
        }}
      >
        <Typography variant="h6">Map Placeholder</Typography>
        {/* TODO: Tích hợp Google Maps hoặc Mapbox vào đây */}
      </Box>
    </Box>
  );
};

export default MapContainer;