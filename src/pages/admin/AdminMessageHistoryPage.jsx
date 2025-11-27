import React from 'react';
import { Box, Typography } from '@mui/material';

import AdminMessageHistoryTable from '../../components/admin/message/AdminMessageHistoryTable';

const AdminMessageHistoryPage = () => {
  return (
    <Box sx={{ p: 3, flexGrow: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Lịch sử gửi tin nhắn
      </Typography>

      <AdminMessageHistoryTable />
    </Box>
  );
};

export default AdminMessageHistoryPage;
