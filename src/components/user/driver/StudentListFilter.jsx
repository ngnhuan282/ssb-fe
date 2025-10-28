// src/components/user/driver/StudentListFilter.jsx
import React from 'react';
import {
  Box,
  TextField,
  Tabs,
  Tab,
  Paper,
  InputAdornment,
  Badge,
} from '@mui/material';
import {
  Search,
} from '@mui/icons-material';

const StudentListFilter = ({ 
  searchTerm, 
  onSearchChange, 
  activeTab, 
  onTabChange,
  stats = { all: 0, pending: 0, pickedUp: 0, droppedOff: 0 }
}) => {
  const tabs = [
    { label: 'Tất cả', value: 'all', count: stats.all },
    { label: 'Chưa đón', value: 'pending', count: stats.pending },
    { label: 'Đã đón', value: 'picked_up', count: stats.pickedUp },
    { label: 'Đã trả', value: 'dropped_off', count: stats.droppedOff },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Tìm kiếm học sinh..."
        value={searchTerm}
        onChange={onSearchChange}
        size="small"
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            bgcolor: '#fff',
            '& fieldset': {
              borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
              borderColor: '#1976d2',
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#9e9e9e', fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Filter Tabs */}
      <Paper sx={{ borderRadius: 1, boxShadow: 0, border: '1px solid #e0e0e0' }}>
        <Tabs
          value={activeTab}
          onChange={onTabChange}
          variant="fullWidth"
          sx={{
            minHeight: 48,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              minHeight: 48,
              color: '#757575',
            },
            '& .Mui-selected': {
              color: '#1976d2',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#1976d2',
              height: 2,
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{tab.label}</span>
                  <Badge
                    badgeContent={tab.count}
                    sx={{
                      '& .MuiBadge-badge': {
                        bgcolor: activeTab === tab.value ? '#1976d2' : '#e0e0e0',
                        color: activeTab === tab.value ? '#fff' : '#757575',
                        fontSize: '0.7rem',
                        height: 18,
                        minWidth: 18,
                        fontWeight: 600,
                      },
                    }}
                  />
                </Box>
              }
            />
          ))}
        </Tabs>
      </Paper>
    </Box>
  );
};

export default StudentListFilter;