// src/components/user/driver/StudentListFilter.jsx
import React from 'react';
import {
  Box,
  TextField,
  Tabs,
  Tab,
  InputAdornment,
} from '@mui/material';
import { Search } from '@mui/icons-material';

const StudentListFilter = ({
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
}) => {
  // Bỏ 'count' khỏi tabs
  const tabs = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Chưa đón', value: 'pending' },
    { label: 'Đã đón', value: 'picked_up' },
    { label: 'Đã trả', value: 'dropped_off' },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      {/* Thanh tìm kiếm (style mới) */}
      <TextField
        fullWidth
        placeholder="Tìm kiếm học sinh..."
        value={searchTerm}
        onChange={onSearchChange}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            bgcolor: '#fff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            '& fieldset': { border: 'none' }, // Ẩn viền
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#9ca3af', fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Tabs (style mới, không Paper, không Badge) */}
      <Tabs
        value={activeTab}
        onChange={onTabChange}
        variant="standard" // Đổi sang standard
        sx={{
          minHeight: 40,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            minHeight: 40,
            color: '#6b7280',
            mr: 3, // Khoảng cách giữa các tab
          },
          '& .Mui-selected': {
            color: '#3b82f6', // Màu xanh
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#3b82f6', // Màu xanh
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={tab.label} // Chỉ dùng label
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default StudentListFilter;