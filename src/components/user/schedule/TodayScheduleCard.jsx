// src/components/user/schedule/TodayScheduleCard.jsx
import React from 'react';
import {
  Card, CardContent, Typography, Box, Chip, Grid
} from '@mui/material';
import { AccessTime, DirectionsBus } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const TodayScheduleCard = ({ schedule }) => {
  const { t, i18n } = useTranslation();
  
  if (!schedule) return null;

  const formatTime = (t) => {
    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
    return new Date(t).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <DirectionsBus sx={{ color: '#3b82f6' }} />
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
            {schedule.route?.name || t("todaySchedule.noRoute")}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AccessTime sx={{ color: '#64748b', fontSize: 18 }} />
          <Typography variant="body2" sx={{ color: '#475569' }}>
            {formatTime(schedule.starttime)} - {formatTime(schedule.endtime)}
          </Typography>
        </Box>

        {schedule.bus && (
          <Chip
            label={schedule.bus.licensePlate}
            size="small"
            sx={{ bgcolor: '#e0e7ff', color: '#4f46e5', fontWeight: 500 }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TodayScheduleCard;