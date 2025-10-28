// src/components/user/driver/StudentCard.jsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  IconButton,
  Checkbox,
  Chip,
  Button,
  Collapse,
} from '@mui/material';
import {
  Phone,
  LocationOn,
  ExpandMore,
  ExpandLess,
  CheckCircle,
  Circle,
} from '@mui/icons-material';

const StudentCard = ({ student, onCheckIn, onCallParent }) => {
  const [expanded, setExpanded] = useState(false);
  const [checked, setChecked] = useState(student.status === 'picked_up');

  const handleCheckChange = (event) => {
    setChecked(event.target.checked);
    onCheckIn && onCheckIn(student._id, event.target.checked);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'picked_up': return { bg: '#e8f5e9', text: '#2e7d32' };
      case 'dropped_off': return { bg: '#e3f2fd', text: '#1565c0' };
      default: return { bg: '#f5f5f5', text: '#757575' };
    }
  };

  const statusColor = getStatusColor(student.status);
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card
      sx={{
        boxShadow: 0,
        borderRadius: 1,
        mb: 1.5,
        border: '1px solid',
        borderColor: checked ? '#1976d2' : '#e0e0e0',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: '#1976d2',
          boxShadow: 1,
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {/* Checkbox */}
          <Checkbox
            checked={checked}
            onChange={handleCheckChange}
            icon={<Circle sx={{ color: '#bdbdbd' }} />}
            checkedIcon={<CheckCircle sx={{ color: '#4caf50' }} />}
            sx={{ p: 0, mt: 0.5 }}
          />

          {/* Avatar */}
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: checked ? '#4caf50' : '#1976d2',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {getInitials(student.fullName)}
          </Avatar>

          {/* Info */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#212121', mb: 0.5 }}>
                  {student.fullName}
                </Typography>
                <Typography variant="caption" sx={{ color: '#757575' }}>
                  {student.class}
                </Typography>
              </Box>
              <Chip
                label={
                  student.status === 'picked_up' ? 'Đã đón' :
                  student.status === 'dropped_off' ? 'Đã trả' : 'Chưa đón'
                }
                size="small"
                sx={{
                  bgcolor: statusColor.bg,
                  color: statusColor.text,
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  height: 22,
                }}
              />
            </Box>

            {/* Pickup Point */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mb: 1 }}>
              <LocationOn sx={{ fontSize: 16, color: '#9e9e9e', mt: 0.2 }} />
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}>
                {student.pickupPoint}
              </Typography>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                size="small"
                startIcon={<Phone sx={{ fontSize: 16 }} />}
                onClick={() => onCallParent && onCallParent(student.parent?.user?.phone)}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  color: '#1976d2',
                  minWidth: 'auto',
                  px: 1,
                  py: 0.5,
                  '&:hover': {
                    bgcolor: '#e3f2fd',
                  },
                }}
              >
                Gọi
              </Button>
              
              <IconButton
                size="small"
                onClick={() => setExpanded(!expanded)}
                sx={{ ml: 'auto', p: 0.5 }}
              >
                {expanded ? <ExpandLess sx={{ fontSize: 20 }} /> : <ExpandMore sx={{ fontSize: 20 }} />}
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Expanded Details */}
        <Collapse in={expanded}>
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f5f5f5', ml: 7 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#9e9e9e', display: 'block', mb: 0.5 }}>
                  Phụ huynh
                </Typography>
                <Typography variant="body2" sx={{ color: '#424242' }}>
                  {student.parent?.user?.username || 'Chưa có thông tin'}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" sx={{ color: '#9e9e9e', display: 'block', mb: 0.5 }}>
                  Số điện thoại
                </Typography>
                <Typography variant="body2" sx={{ color: '#424242' }}>
                  {student.parent?.user?.phone || 'Chưa có thông tin'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: '#9e9e9e', display: 'block', mb: 0.5 }}>
                  Điểm trả
                </Typography>
                <Typography variant="body2" sx={{ color: '#424242' }}>
                  {student.dropoffPoint}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default StudentCard; 