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
  Schedule,
  ExpandMore,
  ExpandLess,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';

const StudentCard = ({ student, onCheckIn, onCallParent, onReportAbsent }) => {
  const [expanded, setExpanded] = useState(false);
  const [checked, setChecked] = useState(student.status === 'picked_up');

  const handleCheckChange = (event) => {
    setChecked(event.target.checked);
    onCheckIn && onCheckIn(student.id, event.target.checked);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'picked_up': return { bg: '#d4edda', text: '#155724' };
      case 'dropped_off': return { bg: '#cce5ff', text: '#004085' };
      case 'absent': return { bg: '#f8d7da', text: '#721c24' };
      default: return { bg: '#fff3cd', text: '#856404' };
    }
  };

  const statusColor = getStatusColor(student.status);

  return (
    <Card
      sx={{
        boxShadow: 2,
        borderRadius: 2,
        mb: 2,
        border: checked ? '2px solid #27ae60' : '1px solid #ecf0f1',
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {/* Checkbox */}
          <Checkbox
            checked={checked}
            onChange={handleCheckChange}
            icon={<Cancel sx={{ color: '#e74c3c' }} />}
            checkedIcon={<CheckCircle sx={{ color: '#27ae60' }} />}
            sx={{ mt: 0.5 }}
          />

          {/* Avatar */}
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: checked ? '#27ae60' : '#667eea',
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            {student.name.charAt(0)}
          </Avatar>

          {/* Info */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', mb: 0.5 }}>
                  {student.name}
                </Typography>
                <Chip
                  label={student.class}
                  size="small"
                  sx={{ bgcolor: '#e8eaf6', color: '#5c6bc0', fontSize: 11 }}
                />
              </Box>
              <Chip
                label={
                  student.status === 'picked_up' ? 'Đã đón' :
                  student.status === 'dropped_off' ? 'Đã trả' :
                  student.status === 'absent' ? 'Vắng' : 'Chưa đón'
                }
                size="small"
                sx={{
                  bgcolor: statusColor.bg,
                  color: statusColor.text,
                  fontWeight: 600,
                }}
              />
            </Box>

            {/* Basic Info */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 16, color: '#95a5a6' }} />
                <Typography variant="body2" color="textSecondary">
                  {student.pickupPoint}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule sx={{ fontSize: 16, color: '#95a5a6' }} />
                <Typography variant="body2" color="textSecondary">
                  Giờ đón: {student.pickupTime}
                </Typography>
              </Box>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                startIcon={<Phone />}
                onClick={() => onCallParent && onCallParent(student.parentPhone)}
                sx={{
                  textTransform: 'none',
                  color: '#667eea',
                  borderColor: '#667eea',
                }}
                variant="outlined"
              >
                Gọi PH
              </Button>
              <Button
                size="small"
                onClick={() => onReportAbsent && onReportAbsent(student.id)}
                sx={{
                  textTransform: 'none',
                  color: '#e74c3c',
                  borderColor: '#e74c3c',
                }}
                variant="outlined"
              >
                Báo vắng
              </Button>
              <IconButton
                size="small"
                onClick={() => setExpanded(!expanded)}
                sx={{ ml: 'auto' }}
              >
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Expanded Details */}
        <Collapse in={expanded}>
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #ecf0f1' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#34495e' }}>
              Thông tin chi tiết
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="textSecondary">
                  SĐT phụ huynh:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {student.parentPhone}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="textSecondary">
                  Địa chỉ đầy đủ:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>
                  {student.fullAddress}
                </Typography>
              </Box>
              {student.notes && (
                <Box sx={{ bgcolor: '#fff3cd', p: 1, borderRadius: 1, mt: 1 }}>
                  <Typography variant="caption" sx={{ color: '#856404' }}>
                    📝 Ghi chú: {student.notes}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default StudentCard;