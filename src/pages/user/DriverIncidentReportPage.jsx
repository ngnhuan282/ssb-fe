import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import IncidentForm from '../../components/user/incident/IncidentForm';
import IncidentHistory from '../../components/user/incident/IncidentHistory';
import { useTranslation } from 'react-i18next';

const IncidentPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('new');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3, flexGrow: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 3 }}>
        {t('incident.pageTitle')}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: '#ef4444' },
            '& .Mui-selected': { color: '#ef4444 !important', fontWeight: 600 },
            '& .MuiTab-root': {
              textTransform: 'none',
              color: '#6b7280',
              fontWeight: 500,
            },
          }}
        >
          <Tab label={t('incident.tabNew')} value="new" />
          <Tab label={t('incident.tabHistory')} value="history" />
        </Tabs>
      </Box>

      <Box>
        {activeTab === 'new' && <IncidentForm />}
        {activeTab === 'history' && <IncidentHistory />}
      </Box>
    </Box>
  );
};

export default IncidentPage;