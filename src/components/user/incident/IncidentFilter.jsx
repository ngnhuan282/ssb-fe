// src/components/incidents/IncidentFilter.jsx
import React from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Button,
} from '@mui/material';

const IncidentFilter = ({ filters, onFilterChange, onClearFilters }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mb: 3,
      }}
    >
      {/* Lọc Loại sự cố */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <Select
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
          displayEmpty
          sx={{ borderRadius: 2, bgcolor: '#ffffff' }}
        >
          <MenuItem value="">
            <em>Loại sự cố</em>
          </MenuItem>
          <MenuItem value="traffic_delay">Traffic Delay</MenuItem>
          <MenuItem value="student_misconduct">Student Misconduct</MenuItem>
          <MenuItem value="bus_breakdown">Bus Breakdown</MenuItem>
          <MenuItem value="minor_accident">Minor Accident</MenuItem>
        </Select>
      </FormControl>

      {/* Lọc Trạng thái */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <Select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          displayEmpty
          sx={{ borderRadius: 2, bgcolor: '#ffffff' }}
        >
          <MenuItem value="">
            <em>Trạng thái</em>
          </MenuItem>
          <MenuItem value="resolved">Đã giải quyết</MenuItem>
          <MenuItem value="pending">Đang xử lý</MenuItem>
          <MenuItem value="urgent">Khẩn cấp</MenuItem>
        </Select>
      </FormControl>

      {/* Lọc Khoảng thời gian */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <Select
          value={filters.time}
          onChange={(e) => onFilterChange('time', e.target.value)}
          displayEmpty
          sx={{ borderRadius: 2, bgcolor: '#ffffff' }}
        >
          <MenuItem value="">
            <em>Khoảng thời gian</em>
          </MenuItem>
          <MenuItem value="today">Hôm nay</MenuItem>
          <MenuItem value="last_7_days">7 ngày qua</MenuItem>
          <MenuItem value="last_30_days">30 ngày qua</MenuItem>
        </Select>
      </FormControl>

      {/* Nút Clear Filters */}
      <Button
        variant="text"
        onClick={onClearFilters}
        sx={{
          ml: 'auto',
          textTransform: 'none',
          color: '#6b7280',
          '&:hover': { bgcolor: 'transparent', color: '#111827' },
        }}
      >
        Clear Filters
      </Button>
    </Box>
  );
};

export default IncidentFilter;