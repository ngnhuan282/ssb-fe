// src/pages/user/TripHistoryPage.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import vi from 'date-fns/locale/vi';
import { useNavigate } from 'react-router-dom';
import TripHistoryTable from '../../components/user/trip/TripHistoryTable';

// Dữ liệu giả lập
const mockTrips = [
  { id: 'T01-2610', date: '26/10/2023', route: 'Tuyến 01', startTime: '06:30 AM', endTime: '07:15 AM', status: 'completed' },
  { id: 'T02-2510', date: '25/10/2023', route: 'Tuyến 02', startTime: '06:45 AM', endTime: '07:30 AM', status: 'completed' },
  { id: 'T01-2410', date: '24/10/2023', route: 'Tuyến 01', startTime: '06:30 AM', endTime: '07:20 AM', status: 'delayed' },
  { id: 'T03-2310', date: '23/10/2023', route: 'Tuyến 03', startTime: '07:00 AM', endTime: '-', status: 'cancelled' },
  { id: 'T02-2210', date: '22/10/2023', route: 'Tuyến 02', startTime: '06:45 AM', endTime: '07:35 AM', status: 'completed' },
  { id: 'T01-2110', date: '21/10/2023', route: 'Tuyến 01', startTime: '07:12 AM', endTime: '07:12 AM', status: 'completed' },
];

const TripHistoryPage = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date('2023-10-01'));
  const [endDate, setEndDate] = useState(new Date('2023-10-26'));

  const handleViewDetails = (tripId) => {
    // Chuyển hướng đến trang chi tiết
    navigate(`/trip-history/${tripId}`);
  };

  return (
    <Box sx={{ p: 3, flexGrow: 1 }}>
      {/* Tiêu đề */}
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 3 }}>
        Lịch sử chuyến đi
      </Typography>

      {/* Bộ lọc ngày tháng */}
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
          <DatePicker
            label="Từ ngày"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => (
              <TextField 
                {...params} 
                size="small" 
                sx={{ bgcolor: '#fff', borderRadius: 2 }} 
              />
            )}
          />
          <DatePicker
            label="Đến ngày"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => (
              <TextField 
                {...params} 
                size="small" 
                sx={{ bgcolor: '#fff', borderRadius: 2 }} 
              />
            )}
          />
        </Box>
      </LocalizationProvider>

      {/* Bảng lịch sử */}
      <TripHistoryTable
        trips={mockTrips}
        onViewDetails={handleViewDetails}
      />

      {/* TODO: Thêm Pagination ở đây nếu cần */}
    </Box>
  );
};

export default TripHistoryPage;