// src/components/driver/pickup/PickupPointItem.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Collapse,
  IconButton,
  Divider,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  CheckCircle,
} from '@mui/icons-material';
import StudentItem from './StudentItem';

const PickupPointItem = ({ point, onStudentStatusChange, onPickupAll }) => {
  const [expanded, setExpanded] = useState(true); // Mặc định mở
  const { name, studentCount, students, status } = point;
  const isCompleted = status === 'completed';

  return (
    <Box
      sx={{
        mb: 1.5,
        borderRadius: 3,
        border: '1px solid',
        borderColor: isCompleted ? '#22c55e' : '#e5e7eb',
        bgcolor: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* Header của điểm đón */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#111827' }}>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            {studentCount} học sinh
          </Typography>
        </Box>
        <IconButton sx={{ ml: 1 }}>
          {isCompleted ? (
            <CheckCircle sx={{ color: '#22c55e' }} />
          ) : expanded ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )}
        </IconButton>
      </Box>

      {/* Nội dung thu gọn (Học sinh và nút) */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider sx={{ mx: 2 }} />
        <Box sx={{ p: 2 }}>
          {/* Nút Đón tất cả */}
          {!isCompleted && (
            <Button
              variant="contained"
              fullWidth
              onClick={() => onPickupAll(point.id)}
              sx={{
                mb: 2,
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                bgcolor: '#22c55e', // Màu xanh lá
                '&:hover': {
                  bgcolor: '#16a34a',
                },
              }}
            >
              Đón tất cả
            </Button>
          )}

          {/* Danh sách học sinh */}
          {students.map((student) => (
            <StudentItem
              key={student.id}
              student={student}
              onStatusChange={onStudentStatusChange}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default PickupPointItem;