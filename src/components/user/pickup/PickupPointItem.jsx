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
  Navigation,
} from '@mui/icons-material';
import StudentItem from './StudentItem';

const PickupPointItem = ({ point, onStudentStatusChange, onPickupAll,onDropoffAll,isStillPickingUp , onNavigate}) => {
  const [expanded, setExpanded] = useState(false); // Mặc định dong
  const { name, studentCount, students, status , stopIndex} = point;
  const isCompleted = status === 'completed';

  const hasPendingPickups = students.some(s => s.status === 'waiting' && s.type === 'pickup');
  const hasPendingDropoffs = students.some((s) => s.status === 'waiting' && s.type === 'dropoff');
  const hasPickupStudents = students.some((s) => s.type === 'pickup');
  const isDisabled = isStillPickingUp && !hasPickupStudents;



  return (
    <Box
      sx={{
        mb: 1.5,
        borderRadius: 3,
        border: '1px solid',
        borderColor: isCompleted ? '#22c55e' : '#e5e7eb',
        bgcolor: '#ffffff',
        overflow: 'hidden',
        opacity: isDisabled ? 0.4 : 1,
        pointerEvents: isDisabled ? 'none' : 'auto',
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
      >
        <Box
          sx={{ flex: 1, cursor: 'pointer', pr: 1 }}
          onClick={() => !isDisabled && setExpanded(!expanded)}
        >
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#111827' }}>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            {studentCount} học sinh
          </Typography>
        </Box>  

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
          {!isCompleted && !isDisabled && (
            <IconButton 
              sx={{ color: '#6e7075ff' }}
              onClick={(e) => {
                e.stopPropagation(); // Ngăn việc expand/collapse khi bấm
                onNavigate(point);
              }}
            >
              <Navigation />
            </IconButton>
          )}
        <IconButton 
          sx={{ ml: 1 }}
          onClick={() => !isDisabled && setExpanded(!expanded)}
        >
          {isCompleted ? (
            <CheckCircle sx={{ color: '#22c55e' }} />
          ) : expanded ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )}
        </IconButton>
        </Box>
      </Box>

      {/* Nội dung thu gọn (Học sinh và nút) */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider sx={{ mx: 2 }} />
        <Box sx={{ p: 2 }}>
          {/* Nút Đón tất cả */}
          {!isCompleted && hasPendingPickups && (
            <Button
              variant="contained"
              fullWidth
              onClick={() => onPickupAll(stopIndex)}
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
          {/* --- NÚT TRẢ TẤT CẢ MỚI --- */}
          {!isCompleted && hasPendingDropoffs && (
            <Button
              variant="contained"
              fullWidth
              onClick={() => onDropoffAll(stopIndex)}
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
              Trả tất cả
            </Button>
          )}

          {/* Danh sách học sinh */}
          {students.map((student) => (
            <StudentItem
              key={student.id}
              student={student}
              onStatusChange={(newStatus) => 
                onStudentStatusChange(stopIndex, student.id, newStatus)
              }
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default PickupPointItem;