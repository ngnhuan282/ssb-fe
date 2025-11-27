import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import AdminMessageForm from '../../components/admin/message/AdminMessageForm';
import AdminMessageHistoryTable from '../../components/admin/message/AdminMessageHistoryTable';

const NotificationPage = () => {
  const [activeTab, setActiveTab] = useState('send');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3, flexGrow: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 3 }}>
        Quản lý tin nhắn
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: '#ef4444' },
            '& .Mui-selected': { color: '#ef4444 !important', fontWeight: 600 },
            '& .MuiTab-root': { textTransform: 'none', color: '#6b7280', fontWeight: 500 },
          }}
        >
          <Tab label="Gửi tin nhắn" value="send" />
          <Tab label="Lịch sử tin nhắn" value="history" />
        </Tabs>
      </Box>

      <Box>
        {activeTab === 'send' && <AdminMessageForm />}
        {activeTab === 'history' && <AdminMessageHistoryTable />}
      </Box>
    </Box>
  );
};

export default NotificationPage;
