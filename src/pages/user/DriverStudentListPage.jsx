// src/pages/user/DriverStudentListPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Snackbar,
  Alert,
  Pagination, // <-- THÊM
} from '@mui/material';
import StudentListFilter from '../../components/user/student/StudentListFilter';
import StudentCard from '../../components/user/student/StudentCard';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from "react-i18next";
const ITEMS_PER_PAGE = 5; // Số học sinh trên mỗi trang

const DriverStudentListPage = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  // --- THÊM STATE CHO PHÂN TRANG ---
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    fetchStudents();
  }, []);

  // LỌC THEO NAME + TAB
  useEffect(() => {
    let filtered = students;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(student => {
        const name = (student.fullName || '').toLowerCase();
        return name.includes(term);
      });
    }

    if (activeTab !== 'all') {
      filtered = filtered.filter(student => student.status === activeTab);
    }

    setFilteredStudents(filtered);
    // Tính toán số trang
    setPageCount(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    // Reset về trang 1 khi filter
    setPage(1); 
  }, [students, searchTerm, activeTab]);

  // LẤY DỮ LIỆU TỪ DB
  const fetchStudents = async () => {
    // ... (Giữ nguyên logic fetchStudents) ...
    setLoading(true);
    try {
      const response = await studentAPI.getAll();
      const data = response.data.data;
      setStudents(data);
    } catch (err) {
      setError('Lỗi kết nối DB');
      setSnackbar({ open: true, message: 'Không tải được', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // HÀM GỌI ĐIỆN
  const handleCallParent = (phone) => {
    // ... (Giữ nguyên) ...
    if (phone) {
      window.location.href = `tel:${phone}`;
    } else {
      setSnackbar({ open: true, message: 'Không có số điện thoại', severity: 'warning' });
    }
  };

  // --- THÊM HÀM THAY ĐỔI TRANG ---
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // --- TÍNH TOÁN HỌC SINH CHO TRANG HIỆN TẠI ---
  const paginatedStudents = filteredStudents.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // ... (Giữ nguyên logic loading và error) ...
  if (loading && students.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Đang tải dữ liệu...</Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={fetchStudents} sx={{ mt: 2 }}>Thử lại</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', pt: 3, pb: 10 }}>
      <Container maxWidth="xl">
        
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 3 }}>
          Danh sách học sinh
        </Typography>

        <StudentListFilter
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          activeTab={activeTab}
          onTabChange={(e, newValue) => setActiveTab(newValue)}
        />

        {loading && students.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress />
          </Box>
        )}

        {/* Student List */}
        {filteredStudents.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px solid #e5e7eb', bgcolor: '#fff' }}>
            <Typography variant="body1" color="textSecondary">
              {t("studentList.noResults")}
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* SỬ DỤNG paginatedStudents ĐỂ MAP */}
            {paginatedStudents.map((student) => (
              <StudentCard
                key={student._id}
                student={student}
                onCallParent={() => handleCallParent(student.parent?.user?.phone)}
              />
            ))}
          </Box>
        )}

        {/* --- THÊM COMPONENT PHÂN TRANG --- */}
        {pageCount > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
              color="primary"
              sx={{
                '& .Mui-selected': {
                  bgcolor: '#3b82f6 !important',
                  color: '#fff',
                },
                '& .MuiPaginationItem-root': {
                  '&:hover': {
                    bgcolor: '#eff6ff',
                  },
                },
              }}
            />
          </Box>
        )}

        {/* Snackbar (Giữ nguyên) */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default DriverStudentListPage;