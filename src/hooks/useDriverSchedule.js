// src/hooks/useDriverSchedule.js
import { useState, useEffect } from 'react';
import { scheduleAPI } from '../services/api';

export const useDriverSchedule = () => {
  const [todaySchedule, setTodaySchedule] = useState(null);
  const [allSchedules, setAllSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [driverId, setDriverId] = useState(null);

  const getDriverId = () => {
    try {
      const userJson = localStorage.getItem('user');
      if (!userJson) return null;
      const user = JSON.parse(userJson);
      if (user.role !== 'driver') return null;
      return user._id || user.id;
    } catch (err) {
      console.error('Lỗi đọc user:', err);
      return null;
    }
  };

  const fetchSchedules = async (dId) => {
    if (!dId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await scheduleAPI.getByDriver(dId);
      console.log('API getByDriver response:', res.data); // LOG

      const rawData = res.data;
      let schedules = [];

      if (Array.isArray(rawData)) {
        schedules = rawData;
      } else if (rawData?.data && Array.isArray(rawData.data)) {
        schedules = rawData.data;
      } else if (rawData?.schedules && Array.isArray(rawData.schedules)) {
        schedules = rawData.schedules;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayScheduleData = schedules.find(s => {
        if (!s.date) return false;
        const sDate = new Date(s.date);
        sDate.setHours(0, 0, 0, 0);
        return sDate.getTime() === today.getTime();
      });

      console.log('todayScheduleData:', todayScheduleData); // LOG
      setTodaySchedule(todayScheduleData || null);
      setAllSchedules(schedules);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi tải lịch');
      console.error('Lỗi fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const dId = getDriverId();
      console.log('Driver ID:', dId);
      setDriverId(dId);

      if (dId) {
        await fetchSchedules(dId);
      } else {
        setError('Không tìm thấy tài xế');
        setLoading(false);
      }
    };

    init();

    const interval = setInterval(() => {
      const dId = getDriverId();
      if (dId) fetchSchedules(dId);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const refetch = () => {
    const dId = getDriverId();
    if (dId) fetchSchedules(dId);
  };

  return { todaySchedule, allSchedules, driverId, loading, error, refetch };
};