// src/components/user/driver/StudentPickupDetail.jsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, List, ListItem, ListItemAvatar, Avatar,
  ListItemText, Chip, IconButton, Button, Divider, LinearProgress
} from '@mui/material';
import { Close, Person, CheckCircle, Phone, School, RadioButtonUnchecked, Cancel } from '@mui/icons-material';

const StudentPickupDetail = ({ open, onClose, stop, onToggleStudent }) => {
  if (!stop) return null;

  const boardedCount = stop.students?.filter(s => s.status === 'boarded').length || 0;
  const totalCount = stop.students?.length || 0;
  const progress = totalCount > 0 ? (boardedCount / totalCount) * 100 : 0;

  const handleStatusChange = (studentId, status) => {
    onToggleStudent(studentId, status);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', mb: 0.5 }}>Danh sách học sinh</Typography>
            <Typography variant="body2" color="textSecondary">{stop.name}</Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ mt: -1, mr: -1 }}><Close /></IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 2, bgcolor: '#f8f9fa' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50' }}>Tiến độ đón</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#27ae60' }}>{boardedCount}/{totalCount}</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: '#27ae60' } }} />
        </Box>

        {stop.students && stop.students.length > 0 ? (
          <List sx={{ p: 2, pt: 1 }}>
            {stop.students.map(student => (
              <ListItem
                key={student.id}
                sx={{
                  borderRadius: 2, mb: 1, p: 1.5,
                  border: '2px solid',
                  borderColor: student.status === 'boarded' ? '#27ae60' : student.status === 'absent' ? '#e74c3c' : '#e0e0e0',
                  bgcolor: student.status === 'boarded' ? '#d4edda' : student.status === 'absent' ? '#f8d7da' : '#fff',
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{
                    bgcolor: student.status === 'boarded' ? '#27ae60' : student.status === 'absent' ? '#e74c3c' : '#667eea',
                    width: 45, height: 45,
                  }}>
                    {student.status === 'boarded' ? <CheckCircle sx={{ fontSize: 28 }} /> :
                     student.status === 'absent' ? <Cancel sx={{ fontSize: 28 }} /> : <Person sx={{ fontSize: 28 }} />}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>{student.name}</Typography>
                      <Chip icon={<School sx={{ fontSize: 14 }} />} label={student.class} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: '#e3f2fd', color: '#1565c0' }} />
                      {student.status === 'boarded' && <Chip label={`Đã đón - ${student.boardedAt}`} size="small" color="success" sx={{ height: 20, fontSize: '0.7rem' }} />}
                      {student.status === 'absent' && <Chip label="Vắng" size="small" color="error" sx={{ height: 20, fontSize: '0.7rem' }} />}
                      {student.status === 'waiting' && <Chip label="Chờ đón" size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: '#e0e0e0' }} />}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <Phone sx={{ fontSize: 14, color: '#95a5a6' }} />
                      <Typography variant="caption" color="textSecondary">{student.phone || 'Chưa có SĐT'}</Typography>
                    </Box>
                  }
                />

                {/* Nút hành động */}
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {student.status !== 'boarded' && (
                    <Button size="small" variant="contained" color="success" onClick={() => handleStatusChange(student.id, 'boarded')}>
                      Đón
                    </Button>
                  )}
                  {student.status !== 'absent' && (
                    <Button size="small" variant="outlined" color="error" onClick={() => handleStatusChange(student.id, 'absent')}>
                      Vắng
                    </Button>
                  )}
                  {student.status === 'boarded' && (
                    <Button size="small" variant="text" onClick={() => handleStatusChange(student.id, 'waiting')}>
                      Hủy
                    </Button>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Person sx={{ fontSize: 60, color: '#ccc', mb: 1 }} />
            <Typography variant="body2" color="textSecondary">Không có học sinh</Typography>
          </Box>
        )}
      </DialogContent>

      <Divider />
      <DialogActions sx={{ p: 2 }}>
        <Typography variant="caption" color="textSecondary" sx={{ flex: 1 }}>Nhấn nút để thay đổi trạng thái</Typography>
        <Button onClick={onClose} variant="contained" sx={{ textTransform: 'none', fontWeight: 600 }}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentPickupDetail;