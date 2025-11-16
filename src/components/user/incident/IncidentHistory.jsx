// src/components/incidents/IncidentHistory.jsx
import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { notificationAPI } from "../../../services/api";

// ====================== BỘ LỌC ======================
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
        <MenuItem value="Tai nạn">Tai nạn</MenuItem>
        <MenuItem value="Tắc đường">Tắc đường</MenuItem>
        <MenuItem value="Hỏng xe">Hỏng xe</MenuItem>
        <MenuItem value="Sự cố học sinh">Sự cố học sinh</MenuItem>
        <MenuItem value="Khác">Khác</MenuItem>
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

// ====================== CHIP TRẠNG THÁI ======================
const StatusChip = ({ status }) => {
  const props = {
    resolved: { label: 'Đã giải quyết', sx: { bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 600 } },
    pending: { label: 'Đang xử lý', sx: { bgcolor: '#fef3c7', color: '#d97706', fontWeight: 600 } },
    urgent: { label: 'Khẩn cấp', sx: { bgcolor: '#fee2e2', color: '#ef4444', fontWeight: 600 } },
  };
  return <Chip size="small" {...(props[status] || { label: status })} />;
};

// ====================== MAIN COMPONENT ======================
const IncidentHistory = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ type: '', status: '', time: '' });
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dữ liệu sự cố (emergency)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await notificationAPI.getEmergency();
        setIncidents(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError('Không thể tải dữ liệu sự cố.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ type: '', status: '', time: '' });
  };

  const handleViewDetails = (id) => {
    navigate(`/reports/${id}`);
  };

  // Bộ lọc (hiện tạm thời filter local)
const filteredIncidents = incidents.filter((item) => {
  const itemType = item.emergency_type || item.type;
  
  // Filter theo type
  if (filters.type && itemType !== filters.type) return false;

  // Filter theo status
  if (filters.status && (item.status || (item.type === 'emergency' ? 'urgent' : 'pending')) !== filters.status) return false;

  // Filter theo thời gian
  if (filters.time === 'today') {
    const today = new Date();
    const created = new Date(item.createdAt);
    if (created.toDateString() !== today.toDateString()) return false;
  }

  return true;
});


  return (
    <Box>
      <IncidentFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress color="error" />
        </Box>
      )}

      {/* Error */}
      {!loading && error && (
        <Typography color="error" align="center" sx={{ mt: 3 }}>
          {error}
        </Typography>
      )}

      {/* Table */}
      {!loading && !error && (
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
                <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>NỘI DUNG</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>NGÀY GỬI</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>TRẠNG THÁI</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredIncidents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3, color: '#6b7280' }}>
                    Không có sự cố nào được ghi nhận.
                  </TableCell>
                </TableRow>
              ) : (
                filteredIncidents.map((item) => (
                  <TableRow key={item._id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                    <TableCell sx={{ fontWeight: 500, color: '#111827' }}>
                      {item._id.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{item.emergency_type}</TableCell>
                    <TableCell sx={{ maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.message}
                    </TableCell>
                    <TableCell>{new Date(item.createdAt).toLocaleString('vi-VN')}</TableCell>
                    <TableCell>
                      <StatusChip status={item.status ?? (item.type === 'emergency' ? 'urgent' : 'pending')} />
                    </TableCell>
                    <TableCell>
                      <Link
                        component="button"
                        onClick={() => navigate(`/incident-detail/${item._id}`)}
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
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Phân trang */}
      {!loading && !error && filteredIncidents.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={1}
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
      )}
    </Box>
  );
};

export default IncidentHistory;
