// src/hooks/usePickupPoints.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { scheduleAPI } from '../services/api';
import { getStopTravelInfo } from '../utils/distance';

export const usePickupPoints = (scheduleId) => {
  const [stops, setStops] = useState([]);
  const [route, setRoute] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentLocation = { lat: 10.762622, lng: 106.660172 };
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // Cập nhật khoảng cách
  useEffect(() => {
    if (stops.length === 0) return;

    setStops(prev =>
      prev.map(stop => {
        if (stop.status === 'completed' || stop.status === 'skipped') return stop;
        const { distance, estimatedTime } = getStopTravelInfo(currentLocation, stop.coordinates, 30);
        return { ...stop, distance, estimatedTime };
      })
    );
  }, [stops.length]);

  const getStopStatus = (scheduleData, index) => {
    const currentIndex = scheduleData.currentStopIndex || 0;
    const completedStops = scheduleData.completedStops || [];

    if (completedStops.includes(index)) return 'completed';
    if (currentIndex === index) return 'current';
    if (currentIndex > index) return 'skipped';
    return 'pending';
  };

  const fetchPickupPoints = useCallback(async () => {
    if (!scheduleId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const scheduleRes = await scheduleAPI.getById(scheduleId);
      console.log('API getById response:', scheduleRes.data); // LOG

      const scheduleData = scheduleRes.data?.data || scheduleRes.data;
      if (!scheduleData) throw new Error('Không tìm thấy lịch trình');

      setSchedule(scheduleData);

      // LẤY ROUTE.STOPS VÀ GÁN ORDER
      const rawStops = scheduleData.route?.stops || [];
      if (!Array.isArray(rawStops) || rawStops.length === 0) {
        setStops([]);
        setLoading(false);
        return;
      }

      const transformedStops = rawStops.map((stop, index) => ({
        id: stop._id || `stop-${index}`,
        name: stop.location || `Điểm ${index + 1}`,
        address: stop.address || '',
        coordinates: {
          lat: stop.lat,
          lng: stop.lng
        },
        order: index + 1,
        status: getStopStatus(scheduleData, index),
        students: [],
        distance: null,
        estimatedTime: null
      }));

      // GỌI API LẤY HỌC SINH CHO TỪNG ĐIỂM
      const stopPromises = transformedStops.map(async (stop, idx) => {
        try {
          const studentsRes = await scheduleAPI.getStopStudents(scheduleId, idx);
          const students = (studentsRes.data?.data || studentsRes.data || []).map(s => ({
            ...s,
            status: s.status || 'pending',
            boardedAt: s.boardedAt || null
          }));
          return { ...stop, students };
        } catch (err) {
          console.warn(`Lỗi lấy học sinh điểm ${idx}:`, err);
          return { ...stop, students: [] };
        }
      });

      const finalStops = await Promise.all(stopPromises);
      setStops(finalStops);
      setRoute(scheduleData.route);

    } catch (err) {
      if (isMountedRef.current) {
        setError(err.response?.data?.message || 'Lỗi tải dữ liệu');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [scheduleId]);

  const updateStopStatus = async (stopIndex, status, reason = '') => {
    try {
      await scheduleAPI.updateStop(scheduleId, stopIndex, { status, reason });
      setStops(prev => prev.map((s, i) => {
        if (i === stopIndex) {
          return {
            ...s,
            status,
            completedAt: status === 'completed' ? new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : s.completedAt
          };
        }
        return s;
      }));
    } catch (err) {
      throw err;
    }
  };

  const updateStudentStatus = async (stopIndex, studentId, status) => {
    try {
      await scheduleAPI.updateStudentStatus(scheduleId, stopIndex, studentId, { status });
      setStops(prev => prev.map((stop, i) => {
        if (i === stopIndex) {
          const updatedStudents = stop.students.map(s =>
            s._id === studentId
              ? { ...s, status, boardedAt: status === 'boarded' ? new Date() : s.boardedAt }
              : s
          );
          return { ...stop, students: updatedStudents };
        }
        return stop;
      }));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchPickupPoints();
  }, [fetchPickupPoints]);

  return {
    stops,
    route,
    schedule,
    loading,
    error,
    currentLocation,
    refetch: fetchPickupPoints,
    updateStopStatus,
    updateStudentStatus
  };
};