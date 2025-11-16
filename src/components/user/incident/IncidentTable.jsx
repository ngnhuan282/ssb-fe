import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Link,
} from '@mui/material';

// Hàm render trạng thái
const StatusChip = ({ status }) => {
  const props = {
    resolved: { label: 'Đã hoàn thành', sx: { bgcolor: '#d1fae5', color: '#059669', fontWeight: 600 } },
    pending: { label: 'Đang xử lý', sx: { bgcolor: '#fef3c7', color: '#d97706', fontWeight: 600 } },
    urgent: { label: 'Khẩn cấp', sx: { bgcolor: '#fee2e2', color: '#ef4444', fontWeight: 600 } },
  };
  return <Chip size="small" {...(props[status] || { label: status })} />;
};

const IncidentTable = ({ incidents, onViewDetails }) => {
  const getStatus = (item) => {
    if (item.type === 'resolved') return 'resolved';
    if (item.status) return item.status;
    return item.type === 'emergency' ? 'urgent' : 'pending';
  };

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, bgcolor: '#fff' }}>
      <Table>
        <TableHead sx={{ bgcolor: '#f9fafb' }}>
          <TableRow>
            <TableCell>MÃ BÁO CÁO</TableCell>
            <TableCell>LOẠI SỰ CỐ</TableCell>
            <TableCell>NỘI DUNG</TableCell>
            <TableCell>NGÀY GỬI</TableCell>
            <TableCell>TRẠNG THÁI</TableCell>
            <TableCell>ACTION</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {incidents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Không có sự cố nào được ghi nhận.
              </TableCell>
            </TableRow>
          ) : (
            incidents.map((item) => (
              <TableRow key={item._id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                <TableCell>{item._id.slice(-6).toUpperCase()}</TableCell>
                <TableCell>{item.emergency_type || item.type}</TableCell>
                <TableCell sx={{ maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.message}
                </TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleString('vi-VN')}</TableCell>
                <TableCell>
                  <StatusChip status={getStatus(item)} />
                </TableCell>
                <TableCell>
                  <Link
                    component="button"
                    onClick={() => onViewDetails(item._id)}
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
  );
};

export default IncidentTable;
