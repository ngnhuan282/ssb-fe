// src/pages/user/IncidentPage.jsx
import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import IncidentForm from '../../components/user/incident/IncidentForm';
import IncidentHistory from '../../components/user/incident/IncidentHistory';

const IncidentPage = () => {
  const [activeTab, setActiveTab] = useState('new'); // Mặc định là tab 'Tạo mới'

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3, flexGrow: 1 }}>
      {/* Tiêu đề trang */}
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 3 }}>
        Báo cáo sự cố
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: '#ef4444' },
            '& .Mui-selected': { color: '#ef4444 !important', fontWeight: 600 },
            '& .MuiTab-root': {
              textTransform: 'none',
              color: '#6b7280',
              fontWeight: 500,
            },
          }}
        >
          <Tab label="Tạo báo cáo mới" value="new" />
          <Tab label="Lịch sử báo cáo" value="history" />
        </Tabs>
      </Box>

      {/* Nội dung Tab */}
      <Box>
        {activeTab === 'new' && (
          <IncidentForm />
        )}
        {activeTab === 'history' && (
          <IncidentHistory />
        )}
      </Box>
    </Box>
  );
};

export default IncidentPage;