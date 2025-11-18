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

const IncidentTable = ({ incidents = [], onViewDetails }) => {
  const { t, i18n } = useTranslation();
  const isEN = i18n.language === 'en';

  // Map tiếng Việt → tiếng Anh (cho trường hợp backend trả tiếng Việt)
  const typeMapViToEn = {
    "Tai nạn": "Accident",
    "Tắc đường": "Traffic Delay",
    "Trễ giờ": "Traffic Delay",
    "Hỏng xe": "Bus Breakdown",
    "Sự cố kỹ thuật": "Bus Breakdown",
    "Học sinh nghịch ngợm": "Student Misconduct",
    "Học sinh bị bệnh": "Student Misconduct",
    "Va chạm nhỏ": "Minor Accident",
    "Xe dừng khẩn cấp": "Emergency Stop",
    "Xe hỏng lốp": "Flat Tire",
    "Xe bị kẹt": "Vehicle Stuck",
    "Khác": "Other",
  };

  const getTypeLabel = (rawType) => {
    if (!rawType) return isEN ? "Other" : "Khác";

    const type = rawType.trim();

    // Nếu là tiếng Anh → dùng thẳng i18n
    if (isEN) {
      return (
        t(`incident.form.types.${type.toLowerCase().replace(/\s+/g, '_')}`) ||
        typeMapViToEn[type] ||
        typeMapViToEn[type.replace(/\s+/g, '_')] ||
        "Other"
      );
    }

    // Nếu là tiếng Việt → giữ nguyên (backend trả tiếng Việt)
    return typeMapViToEn[type] ? type : type;
  };

  const getStatusConfig = (item) => {
    const status = (item.status || '').toString().toLowerCase();
    const type = (item.type || '').toString().toLowerCase();

    // Đã giải quyết (có chữ "resolved" ở bất kỳ đâu)
    if (status.includes('resolved')) {
      return { label: t('incident.detail.statusResolved'), bg: '#d1fae5', color: '#059669' };
    }

    // Khẩn cấp (có chữ "emergency" hoặc "urgent")
    if (status.includes('emergency') || status.includes('urgent') || type.includes('emergency')) {
      return { label: t('incident.detail.urgent'), bg: '#fee2e2', color: '#ef4444' };
    }
    // Mặc định: đang xử lý
    return { label: t('incident.detail.pending'), bg: '#fef3c7', color: '#d97706' };
  };

  const StatusChip = ({ item }) => {
    const { label, bg, color } = getStatusConfig(item);
    return <Chip label={label} size="small" sx={{ bgcolor: bg, color, fontWeight: 600 }} />;
  };

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 3 }}>
      <Table>
        <TableHead sx={{ bgcolor: '#f9fafb' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('incident.table.reportId')}</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('incident.table.type')}</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('incident.table.content')}</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('incident.table.date')}</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('incident.table.status')}</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('incident.table.action')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {incidents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 5, color: '#6b7280' }}>
                {t('incident.table.noIncidents')}
              </TableCell>
            </TableRow>
          ) : (
            incidents.map((item) => (
              <TableRow key={item._id} hover>
                <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                  {item._id.slice(-6).toUpperCase()}
                </TableCell>
                <TableCell>{getTypeLabel(item.emergency_type || item.type)}</TableCell>
                <TableCell
                  sx={{ maxWidth: 320, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  title={item.message}
                >
                  {item.message || '-'}
                </TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleString(isEN ? 'en-US' : 'vi-VN')}
                </TableCell>
                <TableCell>
                  <StatusChip item={item} />
                </TableCell>
                <TableCell>
                  <Link
                    component="button"
                    onClick={() => onViewDetails(item._id)}
                    sx={{ color: '#ef4444', fontWeight: 600, textDecoration: 'none' }}
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