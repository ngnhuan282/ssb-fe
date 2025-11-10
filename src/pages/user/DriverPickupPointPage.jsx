// src/pages/driver/PickupPointPage.jsx
import React, { useState } from 'react';
import { Box } from '@mui/material';
import MapContainer from '../../components/user/pickup/MapContainer';
import PickupSidebar from '../../components/user/pickup/PickupSidebar';

// Dữ liệu giả lập
const initialMockData = [
  {
    id: 'point_a',
    name: 'Điểm đón A: 123 Đường ABC',
    studentCount: 2,
    status: 'pending', // pending, completed
    students: [
      { id: 'student_1', name: 'Nguyễn Văn An', status: 'pending' },
      { id: 'student_2', name: 'Trần Thị Bích', status: 'pending' },
    ],
  },
  {
    id: 'point_b',
    name: 'Điểm đón B: 789 Đường GHI',
    studentCount: 1,
    status: 'completed',
    students: [
      { id: 'student_3', name: 'Lê Văn Cường', status: 'picked_up' },
    ],
  },
  {
    id: 'point_c',
    name: 'Điểm đón C: 101 Đường JKL',
    studentCount: 2,
    status: 'pending',
    students: [
      { id: 'student_4', name: 'Phạm Thị Dung', status: 'pending' },
      { id: 'student_5', name: 'Hoàng Văn E', status: 'pending' },
    ],
  },
];

const PickupPointPage = () => {
  const [pickupPoints, setPickupPoints] = useState(initialMockData);

  // Kiểm tra xem tất cả học sinh trong 1 điểm đã được xử lý chưa
  const checkPointCompletion = (students) => {
    return students.every(s => s.status === 'picked_up' || s.status === 'absent');
  };

  // Thay đổi trạng thái 1 học sinh
  const handleStudentStatusChange = (studentId, newStatus) => {
    setPickupPoints((prevPoints) =>
      prevPoints.map((point) => {
        // Tìm học sinh trong điểm
        const studentIndex = point.students.findIndex(s => s.id === studentId);
        if (studentIndex === -1) return point;

        // Cập nhật học sinh
        const updatedStudents = [...point.students];
        updatedStudents[studentIndex] = {
          ...updatedStudents[studentIndex],
          status: newStatus,
        };
        
        // Kiểm tra và cập nhật trạng thái điểm đón
        const isCompleted = checkPointCompletion(updatedStudents);

        return {
          ...point,
          students: updatedStudents,
          status: isCompleted ? 'completed' : 'pending',
        };
      })
    );
  };

  // "Đón tất cả" học sinh tại 1 điểm
  const handlePickupAll = (pointId) => {
    setPickupPoints((prevPoints) =>
      prevPoints.map((point) => {
        if (point.id !== pointId) return point;

        // Cập nhật tất cả học sinh 'pending' sang 'picked_up'
        const updatedStudents = point.students.map(s => 
          s.status === 'pending' ? { ...s, status: 'picked_up' } : s
        );

        // Kiểm tra và cập nhật trạng thái điểm đón
        const isCompleted = checkPointCompletion(updatedStudents);

        return {
          ...point,
          students: updatedStudents,
          status: isCompleted ? 'completed' : 'pending',
        };
      })
    );
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100vh' }}>
      <MapContainer />
      <PickupSidebar
        points={pickupPoints}
        onStudentStatusChange={handleStudentStatusChange}
        onPickupAll={handlePickupAll}
      />
    </Box>
  );
};

export default PickupPointPage;