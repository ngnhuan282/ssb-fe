import React from 'react';
import { Box, FormControl, Select, MenuItem, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const IncidentFilter = ({ filters, onFilterChange, onClearFilters }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <Select
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
          displayEmpty
          sx={{ borderRadius: 2, bgcolor: '#ffffff' }}
        >
          <MenuItem value=""><em>{t('incident.filter.type')}</em></MenuItem>
          <MenuItem value="traffic_delay">{t('incident.form.types.traffic_delay')}</MenuItem>
          <MenuItem value="student_misconduct">{t('incident.form.types.student_misconduct')}</MenuItem>
          <MenuItem value="bus_breakdown">{t('incident.form.types.bus_breakdown')}</MenuItem>
          <MenuItem value="minor_accident">{t('incident.form.types.minor_accident')}</MenuItem>
          <MenuItem value="other">{t('incident.form.types.other')}</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 180 }}>
        <Select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          displayEmpty
          sx={{ borderRadius: 2, bgcolor: '#ffffff' }}
        >
          <MenuItem value=""><em>{t('incident.filter.status')}</em></MenuItem>
          <MenuItem value="pending">{t('incident.detail.pending')}</MenuItem>
          <MenuItem value="resolved">{t('incident.detail.statusResolved')}</MenuItem>
          <MenuItem value="urgent">{t('incident.detail.urgent')}</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 180 }}>
        <Select
          value={filters.time}
          onChange={(e) => onFilterChange('time', e.target.value)}
          displayEmpty
          sx={{ borderRadius: 2, bgcolor: '#ffffff' }}
        >
          <MenuItem value=""><em>{t('incident.filter.timeRange')}</em></MenuItem>
          <MenuItem value="today">{t('incident.filter.today')}</MenuItem>
          <MenuItem value="last7days">{t('incident.filter.last7days')}</MenuItem>
          <MenuItem value="last30days">{t('incident.filter.last30days')}</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="text"
        onClick={onClearFilters}
        sx={{
          ml: 'auto',
          textTransform: 'none',
          color: '#6b7280',
          '&:hover': { bgcolor: 'transparent', color: '#111827' },
        }}
      >
        {t('incident.filter.clearFilters')}
      </Button>
    </Box>
  );
};

export default IncidentFilter;