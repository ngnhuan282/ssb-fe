// src/pages/user/IncidentDetailPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Link,
  CircularProgress,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { notificationAPI } from '../../services/api'; // <-- API call



// Component con cho chip trạng thái
const StatusChip = ({ status }) => {
  const props = {
    resolved: { label: 'Đã hoàn thành', sx: { bgcolor: '#d1fae5', color: '#059669', fontWeight: 600 } },
    pending: { label: 'Đang xử lý', sx: { bgcolor: '#fef3c7', color: '#d97706', fontWeight: 600 } },
    urgent: { label: 'Khẩn cấp', sx: { bgcolor: '#fee2e2', color: '#ef4444', fontWeight: 600 } },
  };
  return <Chip size="small" {...(props[status] || { label: status })} />;
};

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
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Hàm xác định status
  const getStatus = (item) => {
  if (item.type === 'emergency') return 'urgent';
  else if (item.type === 'resolved_emergency') return 'resolved';
  return 'pending';
};




  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await notificationAPI.getById(id); // gọi API backend lấy 1 report theo id
        setReport(res.data.data);
      } catch (err) {
        console.error(err);
        setError('Không tìm thấy báo cáo hoặc có lỗi khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress color="error" />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ mt: 3 }}>
        {error}
      </Typography>
    );
  }

  if (!report) return null;

  return (
    <Box sx={{ p: 3, flexGrow: 1, maxWidth: 960, mx: 'auto' }}>
      {/* Nút quay lại */}
      <Link
        component="button"
        onClick={() => navigate('/incident', { state: { tab: 'history' } })}
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
              Mã báo cáo:{' '}
              <Typography component="span" sx={{ fontWeight: 600, color: '#111827' }}>
                {report._id.slice(-6).toUpperCase()}
              </Typography>
            </Typography>
          </Box>
          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
              Ngày gửi: {new Date(report.createdAt).toLocaleString('vi-VN')}
            </Typography>
            <StatusChip status={getStatus(report)} />
          </Box>
        </Box>

        {/* Thông tin chi tiết */}
        <Box sx={{ pt: 3, pb: 3, borderBottom: '1px solid #e5e7eb' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#111827' }}>
            Thông tin chi tiết
          </Typography>
          <InfoRow title="Loại sự cố" value={report.emergency_type || report.type} />
          <InfoRow title="Thời gian xảy ra" value={report.time || new Date(report.createdAt).toLocaleString('vi-VN')} />
          <InfoRow title="Địa điểm" value={report.location || 'Chưa có'} />
        </Box>

        {/* Mô tả */}
        <Box sx={{ pt: 3, pb: 3, borderBottom: '1px solid #e5e7eb' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#111827' }}>
            Mô tả chi tiết
          </Typography>
          <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.6 }}>
            {report.message || report.description || 'Chưa có mô tả'}
          </Typography>
        </Box>

        {/* Hình ảnh */}
        {report.images && report.images.length > 0 && (
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
        )}
      </Paper>
    </Box>
  );
};

export default IncidentDetailPage;
