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
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, bgcolor: '#e9ecef', '& .MuiLinearProgress-bar': { bgcolor: '#27ae60' } }} />
        </Box>

        {stop.students && stop.students.length > 0 ? (
          <List sx={{ px: 1 }}>
            {stop.students.map((student) => (
              <ListItem key={student._id || student.id} sx={{ px: 1, py: 1.5, borderBottom: '1px solid #f1f3f5', alignItems: 'flex-start' }}>
                <ListItemAvatar>
                  <Avatar src={student.avatar} sx={{ bgcolor: '#bdc3c7', color: '#fff' }}>
                    <Person />
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2c3e50' }}>{student.name}</Typography>
                      <Chip
                        label={student.status === 'boarded' ? 'Đã đón' : student.status === 'absent' ? 'Vắng' : 'Chờ'}
                        size="small"
                        icon={
                          student.status === 'boarded' ? <CheckCircle sx={{ fontSize: 16 }} /> :
                          student.status === 'absent' ? <Cancel sx={{ fontSize: 16 }} /> :
                          <RadioButtonUnchecked sx={{ fontSize: 16 }} />
                        }
                        sx={{
                          height: 24,
                          bgcolor: student.status === 'boarded' ? '#d4edda' : student.status === 'absent' ? '#f8d7da' : '#fff3cd',
                          color: student.status === 'boarded' ? '#155724' : student.status === 'absent' ? '#721c24' : '#856404',
                          '& .MuiChip-icon': { color: 'inherit' }
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <Phone sx={{ fontSize: 14, color: '#95a5a6' }} />
                      <Typography variant="caption" color="textSecondary">{student.phone || 'Chưa có SĐT'}</Typography>
                    </Box>
                  }
                />

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {student.status !== 'boarded' && (
                    <Button size="small" variant="contained" color="success" onClick={() => handleStatusChange(student._id || student.id, 'boarded')}>
                      Đón
                    </Button>
                  )}
                  {student.status !== 'absent' && (
                    <Button size="small" variant="outlined" color="error" onClick={() => handleStatusChange(student._id || student.id, 'absent')}>
                      Vắng
                    </Button>
                  )}
                  {student.status === 'boarded' && (
                    <Button size="small" variant="text" onClick={() => handleStatusChange(student._id || student.id, 'waiting')}>
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