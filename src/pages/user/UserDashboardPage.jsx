// src/pages/user/UserDashboardPage.jsx
import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import {
  DirectionsBus,
  People,
  CheckCircle,  // Icon mới: hoàn thành
  Warning,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// Components
import StatCard from '../../components/user/dashboard/StatCard';
import RecentFeedCard from '../../components/user/dashboard/RecentFeedCard';
import WeeklyActivityChart from '../../components/user/dashboard/WeeklyActivityChart';

const UserDashboardPage = () => {
  const { user } = useAuth();
  const username = user?.username || 'Driver01';

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#1e293b',
            fontSize: { xs: '1.75rem', md: '2.125rem' },
          }}
        >
          Tổng quan hệ thống
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', mt: 0.5 }}>
          Chào mừng trở lại, <strong>{username}</strong>!
        </Typography>
      </Box>

      {/* Main Grid */}
      <Grid container spacing={3}>
        {/* === HÀNG 1: 4 THẺ THỐNG KÊ === */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Tổng số xe buýt" value="12" icon={<DirectionsBus />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Tổng số học sinh" value="280" icon={<People />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Chuyến đã hoàn thành"
            value="12"  // Dữ liệu tĩnh
            icon={<CheckCircle />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Sự cố đã báo cáo" value="2" icon={<Warning />} />
        </Grid>

        {/* === HÀNG 2: THÔNG BÁO + BIỂU ĐỒ === */}
        <Grid item xs={12} lg={7}>
          <RecentFeedCard />
        </Grid>
        <Grid item xs={12} lg={5}>
          <WeeklyActivityChart />
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboardPage;