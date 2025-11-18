import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Link,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const IncidentTable = ({ incidents, onViewDetails }) => {
  const { t } = useTranslation();

  const StatusChip = ({ status }) => {
    const config = {
      resolved: { label: t('incident.detail.statusResolved'), sx: { bgcolor: '#d1fae5', color: '#059669' } },
      pending: { label: t('incident.detail.pending'), sx: { bgcolor: '#fef3c7', color: '#d97706' } },
      urgent: { label: t('incident.detail.urgent'), sx: { bgcolor: '#fee2e2', color: '#ef4444' } },
    };
    return <Chip size="small" {...(config[status] || { label: status })} />;
  };

  const getStatus = (item) => {
    if (item.status === 'resolved') return 'resolved';
    if (item.type === 'emergency') return 'urgent';
    return 'pending';
  };

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, bgcolor: '#fff', boxShadow: 1 }}>
      <Table>
        <TableHead sx={{ bgcolor: '#f9fafb' }}>
          <TableRow>
            <TableCell>{t('incident.table.reportId')}</TableCell>
            <TableCell>{t('incident.table.type')}</TableCell>
            <TableCell>{t('incident.table.content')}</TableCell>
            <TableCell>{t('incident.table.date')}</TableCell>
            <TableCell>{t('incident.table.status')}</TableCell>
            <TableCell>{t('incident.table.action')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {incidents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                {t('incident.table.noIncidents')}
              </TableCell>
            </TableRow>
          ) : (
            incidents.map((item) => (
              <TableRow key={item._id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                <TableCell>{item._id.slice(-6).toUpperCase()}</TableCell>
                <TableCell>{t(`incident.form.types.${item.emergency_type}`) || item.emergency_type}</TableCell>
                <TableCell sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.message}
                </TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                <TableCell><StatusChip status={getStatus(item)} /></TableCell>
                <TableCell>
                  <Link
                    component="button"
                    onClick={() => onViewDetails(item._id)}
                    sx={{ fontWeight: 600, color: '#ef4444', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    {t('incident.table.viewDetails')}
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default IncidentTable;