import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

import AdminMessageForm from '../../components/admin/message/AdminMessageForm';

const AdminSendMessagePage = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Gửi tin nhắn
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <AdminMessageForm />
      </Paper>
    </Box>
  );
};

export default AdminSendMessagePage;
