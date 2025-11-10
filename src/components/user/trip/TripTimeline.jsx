// src/components/trips/TripTimeline.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

// Component con cho 1 mục
const TimelineItem = ({ item, isFirst, isLast }) => {
  const { type, title, subtitle, time } = item;

  return (
    <Box sx={{ display: 'flex', position: 'relative', pb: isLast ? 0 : 3 }}>
      {/* Vạch timeline */}
      <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: 11, width: 2, bgcolor: '#e5e7eb' }} />

      {/* Chấm tròn */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          mr: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            bgcolor: isFirst ? '#ef4444' : '#e5e7eb',
            border: isFirst ? '4px solid #fee2e2' : '4px solid #f3f4f6',
          }}
        />
      </Box>

      {/* Nội dung */}
      <Box sx={{ flex: 1, pt: '2px' }}>
        <Typography variant="body1" sx={{ fontWeight: 500, color: '#111827' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Thời gian */}
      <Typography variant="body2" sx={{ color: '#6b7280', pt: '2px' }}>
        {time}
      </Typography>
    </Box>
  );
};

const TripTimeline = ({ log }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', mb: 3 }}>
        Nhật ký chuyến đi
      </Typography>
      <Box>
        {log.map((item, index) => (
          <TimelineItem
            key={index}
            item={item}
            isFirst={index === 0}
            isLast={index === log.length - 1}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TripTimeline;