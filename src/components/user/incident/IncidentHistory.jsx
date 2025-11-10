// src/components/incidents/IncidentHistory.jsx
import React, { useState } from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Link,
  Paper,
  Pagination,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// --- BỘ LỌC ---
const IncidentFilter = ({ filters, onFilterChange, onClearFilters }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
    <FormControl size="small" sx={{ minWidth: 160 }}>
      <Select
        value={filters.type}
        onChange={(e) => onFilterChange('type', e.target.value)}
        displayEmpty
        sx={{ borderRadius: 2, bgcolor: '#ffffff' }}
      >
        <MenuItem value=""><em>Loại sự cố</em></MenuItem>
        <MenuItem value="traffic_delay">Traffic Delay</MenuItem>
        <MenuItem value="student_misconduct">Student Misconduct</MenuItem>
        <MenuItem value="bus_breakdown">Bus Breakdown</MenuItem>
      </Select>
    </FormControl>
    <FormControl size="small" sx={{ minWidth: 160 }}>
      <Select
        value={filters.status}
        onChange={(e) => onFilterChange('status', e.target.value)}
        displayEmpty
        sx={{ borderRadius: 2, bgcolor: '#ffffff' }}
      >
        <MenuItem value=""><em>Trạng thái</em></MenuItem>
        <MenuItem value="resolved">Đã giải quyết</MenuItem>
        <MenuItem value="pending">Đang xử lý</MenuItem>
        <MenuItem value="urgent">Khẩn cấp</MenuItem>
      </Select>
    </FormControl>
    <FormControl size="small" sx={{ minWidth: 160 }}>
      <Select
        value={filters.time}
        onChange={(e) => onFilterChange('time', e.target.value)}
        displayEmpty
        sx={{ borderRadius: 2, bgcolor: '#ffffff' }}
      >
        <MenuItem value=""><em>Khoảng thời gian</em></MenuItem>
        <MenuItem value="today">Hôm nay</MenuItem>
      </Select>
    </FormControl>
    <Button
      variant="text"
      onClick={onClearFilters}
      sx={{ ml: 'auto', textTransform: 'none', color: '#6b7280' }}
    >
      Clear Filters
    </Button>
  </Box>
);

// --- CHIP TRẠNG THÁI ---
const StatusChip = ({ status }) => {
  const props = {
    resolved: { label: 'Đã giải quyết', sx: { bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 600 } },
    pending: { label: 'Đang xử lý', sx: { bgcolor: '#fef3c7', color: '#d97706', fontWeight: 600 } },
    urgent: { label: 'Khẩn cấp', sx: { bgcolor: '#fee2e2', color: '#ef4444', fontWeight: 600 } },
  };
  return <Chip size="small" {...(props[status] || { label: status })} />;
};

// --- DỮ LIỆU GIẢ LẬP ---
const mockData = [
  { id: 'INC-00125', type: 'Traffic Delay', date: '25/10/2023 16:30', status: 'resolved' },
  { id: 'INC-00124', type: 'Student Misconduct', date: '25/10/2023 08:15', status: 'pending' },
  { id: 'INC-00123', type: 'Bus Breakdown', date: '24/10/2023 14:02', status: 'urgent' },
  { id: 'INC-00122', type: 'Minor Accident', date: '23/10/2023 11:45', status: 'resolved' },
];

const IncidentHistory = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ type: '', status: '', time: '' });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ type: '', status: '', time: '' });
  };

  const handleViewDetails = (id) => {
    // Chuyển hướng đến trang chi tiết
    navigate(`/reports/${id}`); // <-- ĐIỂM LIÊN KẾT
  };

  return (
    <Box>
      <IncidentFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: '1px solid #e5e7eb', borderRadius: 3, bgcolor: '#ffffff' }}
      >
        <Table>
          <TableHead sx={{ bgcolor: '#f9fafb' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>MÃ BÁO CÁO</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>LOẠI SỰ CỐ</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>NGÀY GỬI</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>TRẠNG THÁI</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockData.map((row) => (
              <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                <TableCell sx={{ fontWeight: 500, color: '#111827' }}>{row.id}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell><StatusChip status={row.status} /></TableCell>
                <TableCell>
                  <Link
                    component="button"
                    onClick={() => handleViewDetails(row.id)}
                    sx={{
                      fontWeight: 600,
                      color: '#ef4444',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    View Details
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Phân trang */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={10}
          page={1}
          sx={{
            '& .Mui-selected': {
              bgcolor: '#ef4444 !important',
              color: '#ffffff',
            },
            '& .MuiPaginationItem-root': {
              '&:hover': { bgcolor: '#fee2e2' },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default IncidentHistory;