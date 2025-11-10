// src/pages/user/IncidentDetailPage.jsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Link,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom'; // <-- SỬ DỤNG HOOKS

// Dữ liệu giả lập
const allReports = {
  'INC-00125': { id: 'INC-00125', date: '25/10/2023 16:30', status: 'resolved', type: 'Traffic Delay', time: '25/10/2023 16:00', location: '...', description: '...', images: [] },
  'INC-00124': { id: 'INC-00124', date: '25/10/2023 08:15', status: 'pending', type: 'Student Misconduct', time: '25/10/2023 08:00', location: '...', description: '...', images: [] },
  'SC-10357': {
    id: 'SC-10357',
    date: '15/07/2024 08:15',
    status: 'resolved',
    type: 'Sự cố kỹ thuật',
    time: '15/07/2024 07:45',
    location: '123 Đường ABC, Quận 1, Thành phố Hồ Chí Minh',
    description: 'Xe buýt số hiệu 72B-01234 gặp sự cố động cơ, không thể khởi động lại...',
    images: [
      'https://i.imgur.com/L3kM1b0.jpeg',
      'https://i.imgur.com/V6hGvR8.jpeg',
      'https://i.imgur.com/qL3jCqZ.jpeg',
    ],
  },
};

// Component con cho chip
const StatusChip = ({ status }) => (
  <Chip
    label="Đã giải quyết"
    size="small"
    sx={{ bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 600 }}
  />
);

// Component con cho 1 dòng thông tin
const InfoRow = ({ title, value }) => (
  <Grid container spacing={2} sx={{ mb: 1.5 }}>
    <Grid item xs={12} sm={4}>
      <Typography variant="body2" sx={{ color: '#6b7280' }}>{title}</Typography>
    </Grid>
    <Grid item xs={12} sm={8}>
      <Typography variant="body2" sx={{ fontWeight: 500, color: '#111827' }}>{value}</Typography>
    </Grid>
  </Grid>
);

const IncidentDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID từ URL
  
  // TODO: Thay thế bằng API call
  const report = allReports[id] || allReports['SC-10357']; // Lấy data theo ID

  return (
    <Box sx={{ p: 3, flexGrow: 1, maxWidth: 960, mx: 'auto' }}>
      {/* Nút quay lại */}
      <Link
        component="button"
        onClick={() => navigate(-1)} // <-- ĐIỂM LIÊN KẾT (Quay lại)
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: '#6b7280',
          textDecoration: 'none',
          fontSize: '0.9rem',
          fontWeight: 500,
          mb: 2,
          '&:hover': { color: '#111827' },
        }}
      >
        <ArrowBack sx={{ fontSize: 18, mr: 0.5 }} />
        Lịch sử báo cáo
      </Link>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          border: '1px solid #e5e7eb',
          bgcolor: '#ffffff',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            pb: 2,
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827' }}>
              Chi tiết báo cáo sự cố
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
              Mã báo cáo: <Typography component="span" sx={{ fontWeight: 600, color: '#111827' }}>{report.id}</Typography>
            </Typography>
          </Box>
          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
              Ngày gửi: {report.date}
            </Typography>
            <StatusChip status={report.status} />
          </Box>
        </Box>

        {/* Nội dung... */}
        <Box sx={{ pt: 3, pb: 3, borderBottom: '1px solid #e5e7eb' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#111827' }}>
            Thông tin chi tiết
          </Typography>
          <InfoRow title="Loại sự cố" value={report.type} />
          <InfoRow title="Thời gian xảy ra" value={report.time} />
          <InfoRow title="Địa điểm" value={report.location} />
        </Box>

        <Box sx={{ pt: 3, pb: 3, borderBottom: '1px solid #e5e7eb' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#111827' }}>
            Mô tả chi tiết
          </Typography>
          <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.6 }}>
            {report.description}
          </Typography>
        </Box>

        <Box sx={{ pt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#111827' }}>
            Hình ảnh đính kèm
          </Typography>
          <Grid container spacing={2}>
            {report.images.map((img, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Box
                  component="img"
                  src={img}
                  alt={`Incident image ${index + 1}`}
                  sx={{
                    width: '100%',
                    height: 180,
                    objectFit: 'cover',
                    borderRadius: 2,
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default IncidentDetailPage;