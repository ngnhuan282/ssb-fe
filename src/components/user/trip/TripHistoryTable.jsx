// src/components/trips/TripHistoryTable.jsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Paper,
} from '@mui/material';

// Helper component cho Chip trạng thái
const StatusChip = ({ status }) => {
  const getStatusProps = () => {
    switch (status) {
      case 'completed':
        return {
          label: 'Hoàn thành',
          sx: { bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 600 },
        };
      case 'delayed':
        return {
          label: 'Trễ giờ',
          sx: { bgcolor: '#fef3c7', color: '#d97706', fontWeight: 600 },
        };
      case 'cancelled':
        return {
          label: 'Đã hủy',
          sx: { bgcolor: '#fee2e2', color: '#ef4444', fontWeight: 600 },
        };
      default:
        return { label: status, sx: {} };
    }
  };

  return <Chip size="small" {...getStatusProps()} />;
};

const TripHistoryTable = ({ trips, onViewDetails }) => {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ border: '1px solid #e5e7eb', borderRadius: 3, bgcolor: '#ffffff' }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: '#f9fafb' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>NGÀY</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>TUYẾN</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>GIỜ KHỞI HÀNH</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>GIỜ KẾT THÚC</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>TÌNH TRẠNG</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#6b7280', textAlign: 'center' }}>HÀNH ĐỘNG</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trips.map((row) => (
            <TableRow
              key={row.id}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': { bgcolor: '#f9fafb' },
              }}
            >
              <TableCell sx={{ fontWeight: 500, color: '#111827' }}>{row.date}</TableCell>
              <TableCell>{row.route}</TableCell>
              <TableCell>{row.startTime}</TableCell>
              <TableCell>{row.endTime}</TableCell>
              <TableCell>
                <StatusChip status={row.status} />
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onViewDetails(row.id)}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    fontWeight: 600,
                  }}
                >
                  Xem chi tiết
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TripHistoryTable;