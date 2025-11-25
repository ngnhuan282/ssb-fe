import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Pagination,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import IncidentFilter from './IncidentFilter';
import IncidentTable from './IncidentTable';
import { notificationAPI } from "../../../services/api";
import { useTranslation } from 'react-i18next';
import { useAuth } from "../../../context/AuthContext";

const IncidentHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ type: '', status: '', time: '' });
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await notificationAPI.getEmergency();
        setIncidents(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => setFilters({ type: '', status: '', time: '' });

  const handleViewDetails = (id) => {
    const rolePrefix = user?.role === 'driver' ? '/driver' : '/parent';
    navigate(`${rolePrefix}/incident-detail/${id}`);
  };

  const filteredIncidents = incidents.filter(item => {
    if (filters.type && item.emergency_type !== filters.type) return false;
    const status = item.status || (item.type === 'emergency' ? 'urgent' : 'pending');
    if (filters.status && status !== filters.status) return false;
    if (filters.time === 'today') {
      const today = new Date();
      const created = new Date(item.createdAt);
      if (created.toDateString() !== today.toDateString()) return false;
    }
    return true;
  });

  return (
    <Box>
      <IncidentFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress color="error" />
        </Box>
      ) : (
        <IncidentTable incidents={filteredIncidents} onViewDetails={handleViewDetails} />
      )}

      {/* Pagination nếu cần */}
      {filteredIncidents.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination count={Math.ceil(filteredIncidents.length / 10)} color="primary" />
        </Box>
      )}
    </Box>
  );
};

export default IncidentHistory;