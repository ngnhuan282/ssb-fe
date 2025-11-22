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
import { useEffect } from 'react';
import { useState } from 'react';
import { scheduleAPI } from '../../services/api';
import { studentAPI } from '../../services/api';

const TripDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID từ URL
  const [tripDetails, setTripDetails] = useState(null);

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const calcTripDuration = (start, end) => {
    if (!start || !end) return '';

    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate - startDate; // milliseconds

    const diffMinutes = Math.floor(diffMs / 1000 / 60);
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    if (hours === 0) return `${minutes} phút`;
    return `${hours} giờ ${minutes} phút`;
  };


  const fetchTripDetails = async () => {
    const { data: { data: tripDetail } } = await scheduleAPI.getById(id);
    const { data: { data: students } } = await studentAPI.getAll();
    tripDetail.students = students.filter(student => tripDetail.students.includes(student._id));
    console.log('Raw trip detail data:', tripDetail);
    const tripDetailFormatted = {
      date: new Date(tripDetail.date).toLocaleDateString('vi-VN'),
      info: [
        { title: 'Tuyến đường', value: tripDetail.route?.name || '' },
        { title: 'Thời gian bắt đầu', value: tripDetail.starttime ? new Date(tripDetail.starttime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '' },
        { title: 'Thời gian kết thúc', value: tripDetail.endtime ? new Date(tripDetail.endtime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '' },
        { title: 'Tổng thời gian', value: calcTripDuration(tripDetail.starttime, tripDetail.endtime) }, // Cần tính toán thêm nếu cần
        { title: 'Số học sinh đã đón', value: tripDetail.students.length + " học sinh" || 0 + " học sinh" },
      ],
      log: [
        { type: 'start', title: 'Bắt đầu chuyến đi', time: tripDetail.starttime ? new Date(tripDetail.starttime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '' },
        ...tripDetail.students.map(student => {
          const matchedStop = tripDetail.route?.stops?.find(
            stop => stop.location === student.pickupPoint
          );
          return {
            type: 'stop',
            title: `Đón ${student.fullName || ''}`,
            subtitle: `Tại: ${student.pickupPoint || ''}`,
            time: matchedStop
              ? new Date(matchedStop.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
              : '—',
          };
        }),
        {
          type: 'end', title: 'Kết thúc chuyến đi', time: tripDetail.endtime ? new Date(tripDetail.endtime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''
        },
      ]
    };
    console.log('Fetched trip detail:', tripDetailFormatted);

    setTripDetails(tripDetailFormatted);
  }

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
        {tripDetails ? tripDetails.date : 'Đang tải...'}
      </Typography>

      {/* Thông tin chung */}
      <TripInfoCard info={tripDetails ? tripDetails.info : []} />

      {/* Nhật ký chuyến đi */}
      <TripTimeline log={tripDetails ? tripDetails.log : []} />
    </Box>
  );
};

export default TripDetailPage;