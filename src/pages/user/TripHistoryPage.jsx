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
import { scheduleAPI } from '../../services/api';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { driverAPI } from '../../services/api';

const TripHistoryPage = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date('2025-10-01'));
  const [endDate, setEndDate] = useState(new Date());
  const [tripHistory, setTripHistory] = useState([]);
  const { user } = useAuth();
  const [driver, setDriver] = useState(null);
  const [filteredTrips, setFilteredTrips] = useState([]);

  const fetchAPI = async () => {
    if (!user || !driver) return;
    const schedulesByDriver = await scheduleAPI.getByDriver(driver._id);
    const tripHistoryData = schedulesByDriver.data.data
      .filter(schedule => schedule.status === 'completed' || schedule.status === 'delayed')
      .map(schedule => ({
        id: schedule._id,
        rawDate: schedule.date,
        date: new Date(schedule.date).toLocaleDateString('vi-VN'),
        route: schedule.route?.name,
        startTime: schedule.starttime
          ? new Date(schedule.starttime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          : "",
        endTime: schedule.endtime
          ? new Date(schedule.endtime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          : "",
        status: schedule.status === 'completed' ? 'Hoàn thành' : schedule.status === 'delayed' ? 'Trễ giờ' : '',
      }));

    setTripHistory(tripHistoryData);

  }

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    fetchDriver();
  }, [user]);

  const fetchDriver = async () => {
    if (!user) return;
    try {
      const { data: { data: drivers } } = await driverAPI.getAll();
      const myDriver = drivers.find(d => {
        const driverUserId = d.user?._id?.toString() || d.user?.toString();
        return driverUserId === user._id?.toString();
      });
      setDriver(myDriver);
    } catch (err) {
      console.error('Fetch driver error:', err);
    }
  };

  useEffect(() => {
    if (driver) {
      fetchAPI();
    }
  }, [driver]);

  useEffect(() => {
    if (!tripHistory.length) return;

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const filtered = tripHistory.filter(trip => {
      const tripDate = new Date(trip.rawDate);
      return tripDate >= startDate && tripDate <= endDate;
    });

    setFilteredTrips(filtered);
  }, [startDate, endDate, tripHistory]);

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
        trips={filteredTrips}
        onViewDetails={handleViewDetails}
      />



    </Box>
  );
};

export default TripHistoryPage;