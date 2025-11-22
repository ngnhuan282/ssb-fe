// src/components/user/driver/StudentCard.jsx
import React from 'react';
import { useTranslation } from "react-i18next";
import { Card, Box, Typography, Avatar, Chip, Button } from '@mui/material';

const StudentCard = ({ student, onCallParent }) => {
  const { t } = useTranslation();
  const displayName = student.fullName || t("studentCard.noName");

  const getInitials = (name) => {
    if (!name || name === t("studentCard.noName")) return '?';
    return name.trim().split(' ').filter(w => w).map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusProps = (status) => {
    switch (status) {
      case 'picked_up': return { label: t("studentCard.status.picked_up"), sx: { bgcolor: '#dcfce7', color: '#16a34a' }, borderColor: '#22c55e' };
      case 'dropped_off': return { label: t("studentCard.status.dropped_off"), sx: { bgcolor: '#f3f4f6', color: '#4b5563' }, borderColor: '#9ca3af' };
      default: return { label: t("studentCard.status.pending"), sx: { bgcolor: '#fef3c7', color: '#a16207' }, borderColor: '#f59e0b' };
    }
  };

  const statusProps = getStatusProps(student.status);

  return (
    <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderRadius: 2, border: '1px solid #e5e7eb', borderLeft: `5px solid ${statusProps.borderColor}`, mb: 1.5 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ width: 44, height: 44, bgcolor: '#dbeafe', color: '#3b82f6', fontSize: '1rem', fontWeight: 600 }}>
          {getInitials(displayName)}
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#111827' }}>{displayName}</Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
            {student.class || t("studentCard.noClass")}
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
            {student.pickupPoint || t("studentCard.noPickup")}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
          <Chip label={statusProps.label} size="small" sx={{ ...statusProps.sx, borderRadius: '16px', height: 24, fontSize: '0.75rem' }} />
          <Button variant="text" size="small" onClick={() => onCallParent?.(student.parent?.user?.phone)}
            sx={{ textTransform: 'none', fontSize: '0.875rem', color: '#3b82f6', fontWeight: 600, p: '4px 8px', '&:hover': { bgcolor: '#eff6ff' } }}>
            {t("studentCard.call")}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default StudentCard;