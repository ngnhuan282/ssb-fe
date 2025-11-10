// src/pages/admin/IncidentListPage.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Pagination,
} from '@mui/material';
import IncidentFilter from '../../components/user/incident/IncidentFilter';
import IncidentTable from '../../components/user/incident/IncidentTable';
import { useNavigate } // Dùng để chuyển trang
from 'react-router-dom';

// Dữ liệu giả lập
const mockData = [
  { id: 'INC-00125', type: 'Traffic Delay', date: '25/10/2023 16:30', status: 'resolved' },
  { id: 'INC-00124', type: 'Student Misconduct', date: '25/10/2023 08:15', status: 'pending' },
  { id: 'INC-00123', type: 'Bus Breakdown', date: '24/10/2023 14:02', status: 'urgent' },
  { id: 'INC-00122', type: 'Minor Accident', date: '23/10/2023 11:45', status: 'resolved' },
];

const IncidentListPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    time: '',
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ type: '', status: '', time: '' });
  };

  const handleViewDetails = (id) => {
    // Chuyển đến trang chi tiết
    navigate(`/incidents/${id}`); // Giả sử route là /incidents/:id
  };

  // TODO: Thêm logic lọc mockData dựa trên state 'filters'

  return (
    <Box sx={{ p: 3, flexGrow: 1 }}>
      {/* Tiêu đề trang */}
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 3 }}>
        Lịch sử báo cáo sự cố
      </Typography>

      {/* Component Lọc */}
      <IncidentFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Component Bảng */}
      <IncidentTable
        incidents={mockData}
        onViewDetails={handleViewDetails}
      />

      {/* Component Phân trang */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={10}
          page={1}
          // onChange={...}
          sx={{
            '& .Mui-selected': {
              bgcolor: '#ef4444 !important', // Màu đỏ
              color: '#ffffff',
            },
            '& .MuiPaginationItem-root': {
              '&:hover': {
                bgcolor: '#fee2e2',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default IncidentListPage;