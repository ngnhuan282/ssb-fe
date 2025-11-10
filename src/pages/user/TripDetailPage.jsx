// src/pages/user/TripDetailPage.jsx
import React from 'react';
import {
  Box,
  Typography,
  Link,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import TripInfoCard from '../../components/user/trip/TripInfoCard';
import TripTimeline from '../../components/user/trip/TripTimeline';

// Dữ liệu giả lập
const mockTripDetails = {
  'T02-2510': {
    date: 'Ngày 25 tháng 10 năm 2023',
    info: [
      { title: 'Tuyến đường', value: 'Tuyến 03' }, // Dữ liệu trong ảnh không khớp
      { title: 'Thời gian bắt đầu', value: '07:00 AM' },
      { title: 'Thời gian kết thúc', value: '08:15 AM' },
      { title: 'Tổng thời gian', value: '1 giờ 15 phút' },
      { title: 'Số học sinh đã đón', value: '25' },
    ],
    log: [
      { type: 'start', title: 'Bắt đầu chuyến đi', time: '07:00 AM' },
      { type: 'stop', title: 'Đón em Nguyễn Văn A', subtitle: 'Tại: 123 Đường ABC, Quận 1', time: '07:15 AM' },
      { type: 'stop', title: 'Đón em Trần Thị B', subtitle: 'Tại: 456 Đường XYZ, Quận 3', time: '07:22 AM' },
      { type: 'stop', title: 'Trả em Nguyễn Văn A', subtitle: 'Tại: Trường Tiểu học Quốc Tế', time: '08:05 AM' },
      { type: 'end', title: 'Kết thúc chuyến đi', time: '08:15 AM' },
    ],
  },
  // Thêm các trip khác
};

const TripDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID từ URL
  
  // Lấy dữ liệu (sau này thay bằng API call)
  const trip = mockTripDetails[id] || mockTripDetails['T02-2510']; // Fallback

  return (
    <Box sx={{ p: 3, flexGrow: 1, maxWidth: 960, mx: 'auto' }}>
      {/* Nút quay lại */}
      <Link
        component="button"
        onClick={() => navigate(-1)} // Quay lại trang trước
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: '#6b7280',
          textDecoration: 'none',
          fontSize: '0.9rem',
          fontWeight: 500,
          mb: 2,
          '&:hover': { color: '#111827' },
        }}
      >
        <ArrowBack sx={{ fontSize: 18, mr: 0.5 }} />
        Lịch sử chuyến đi
      </Link>

      {/* Tiêu đề */}
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827' }}>
        Chi tiết chuyến đi
      </Typography>
      <Typography variant="body1" sx={{ color: '#6b7280', mb: 3 }}>
        {trip.date}
      </Typography>

      {/* Thông tin chung */}
      <TripInfoCard info={trip.info} />

      {/* Nhật ký chuyến đi */}
      <TripTimeline log={trip.log} />
    </Box>
  );
};

export default TripDetailPage;