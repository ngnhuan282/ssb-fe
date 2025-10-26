// src/components/user/driver/TimelineView.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
} from '@mui/material';
import {
  FlagCircle,
  LocationOn,
  School,
  CheckCircle,
  RadioButtonUnchecked,
} from '@mui/icons-material';

const TimelineView = ({ stops = [] }) => {
  return (
    <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#2c3e50' }}>
          Lộ trình chi tiết
        </Typography>

        <Stepper orientation="vertical" activeStep={-1}>
          {stops.map((stop, index) => {
            const isCompleted = stop.status === 'completed';
            const isCurrent = stop.status === 'current';
            const isPending = stop.status === 'pending';

            return (
              <Step key={index} active={isCurrent} completed={isCompleted}>
                <StepLabel
                  StepIconComponent={() => {
                    if (stop.type === 'start') return <FlagCircle sx={{ color: '#27ae60' }} />;
                    if (stop.type === 'school') return <School sx={{ color: '#e74c3c' }} />;
                    if (isCompleted) return <CheckCircle sx={{ color: '#27ae60' }} />;
                    if (isCurrent) return <RadioButtonUnchecked sx={{ color: '#f39c12' }} />;
                    return <LocationOn sx={{ color: '#95a5a6' }} />;
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: isCurrent ? 700 : 500,
                        color: isCompleted ? '#27ae60' : isCurrent ? '#f39c12' : '#2c3e50',
                      }}
                    >
                      {stop.time}
                    </Typography>
                    {isCurrent && (
                      <Chip
                        label="Đang đến"
                        size="small"
                        sx={{
                          bgcolor: '#fff3cd',
                          color: '#856404',
                          height: 20,
                          fontSize: 11,
                        }}
                      />
                    )}
                  </Box>
                </StepLabel>
                <StepContent>
                  <Box sx={{ ml: 2, pb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#34495e', mb: 0.5 }}>
                      {stop.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#7f8c8d', display: 'block', mb: 1 }}>
                      {stop.address}
                    </Typography>
                    {stop.students > 0 && (
                      <Chip
                        label={`${stop.students} học sinh`}
                        size="small"
                        sx={{
                          bgcolor: '#e8f5e9',
                          color: '#2e7d32',
                          fontSize: 12,
                        }}
                      />
                    )}
                    {stop.distance && (
                      <Typography variant="caption" sx={{ color: '#95a5a6', display: 'block', mt: 1 }}>
                        📍 Khoảng cách: {stop.distance} | ⏱️ Thời gian: ~{stop.estimatedTime}
                      </Typography>
                    )}
                  </Box>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
      </CardContent>
    </Card>
  );
};

export default TimelineView;