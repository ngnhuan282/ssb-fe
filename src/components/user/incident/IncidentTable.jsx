// src/components/incidents/IncidentTable.jsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Link,
  Paper,
} from '@mui/material';

// Hàm helper để tạo Chip trạng thái
const StatusChip = ({ status }) => {
  const getStatusProps = () => {
    switch (status) {
      case 'resolved':
        return {
          label: 'Đã giải quyết',
          sx: { bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 600 },
        };
      case 'pending':
        return {
          label: 'Đang xử lý',
          sx: { bgcolor: '#fef3c7', color: '#d97706', fontWeight: 600 },
        };
      case 'urgent':
        return {
          label: 'Khẩn cấp',
          sx: { bgcolor: '#fee2e2', color: '#ef4444', fontWeight: 600 },
        };
      default:
        return { label: status, sx: {} };
    }
  };

  return <Chip size="small" {...getStatusProps()} />;
};

const IncidentTable = ({ incidents, onViewDetails }) => {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ border: '1px solid #e5e7eb', borderRadius: 3, bgcolor: '#ffffff' }}
    >
      <Table sx={{ minWidth: 650 }}>
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
          {incidents.map((row) => (
            <TableRow
              key={row.id}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': { bgcolor: '#f9fafb' },
              }}
            >
              <TableCell sx={{ fontWeight: 500, color: '#111827' }}>{row.id}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>
                <StatusChip status={row.status} />
              </TableCell>
              <TableCell>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => onViewDetails(row.id)}
                  sx={{
                    fontWeight: 600,
                    color: '#ef4444', // Màu đỏ
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
  );
};

export default IncidentTable;