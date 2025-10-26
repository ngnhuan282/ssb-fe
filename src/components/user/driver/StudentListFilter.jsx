// src/components/user/driver/StudentListFilter.jsx
import React from 'react';
import {
  Box,
  TextField,
  Tabs,
  Tab,
  Paper,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Search,
  People,
  HourglassEmpty,
  CheckCircle,
  DirectionsBus,
} from '@mui/icons-material';

const StudentListFilter = ({ 
  searchTerm, 
  onSearchChange, 
  activeTab, 
  onTabChange,
  stats = { all: 0, pending: 0, pickedUp: 0, droppedOff: 0 }
}) => {
  const tabs = [
    { label: 'Tất cả', value: 'all', icon: <People />, count: stats.all },
    { label: 'Chưa đón', value: 'pending', icon: <HourglassEmpty />, count: stats.pending },
    { label: 'Đã đón', value: 'picked_up', icon: <CheckCircle />, count: stats.pickedUp },
    { label: 'Đã trả', value: 'dropped_off', icon: <DirectionsBus />, count: stats.droppedOff },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Tìm kiếm học sinh theo tên..."
        value={searchTerm}
        onChange={onSearchChange}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            bgcolor: '#fff',
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#95a5a6' }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Filter Tabs */}
      <Paper sx={{ borderRadius: 2, boxShadow: 2 }}>
        <Tabs
          value={activeTab}
          onChange={onTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              minHeight: 60,
            },
            '& .Mui-selected': {
              color: '#667eea',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#667eea',
              height: 3,
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {tab.icon}
                    <span>{tab.label}</span>
                  </Box>
                  <Chip
                    label={tab.count}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      bgcolor: activeTab === tab.value ? '#667eea' : '#ecf0f1',
                      color: activeTab === tab.value ? '#fff' : '#7f8c8d',
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