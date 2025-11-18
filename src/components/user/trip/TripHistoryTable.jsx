// src/components/trips/TripHistoryTable.jsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Paper,
  Box,
  TablePagination,
  TextField,
  InputAdornment,

} from '@mui/material';
import { Search } from '@mui/icons-material';

// Helper component cho Chip trạng thái
const StatusChip = ({ status }) => {
  const getStatusProps = () => {
    switch (status) {
      case 'Hoàn thành':
        return {
          label: 'Hoàn thành',
          sx: { bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 600 },
        };
      case 'Trễ giờ':
        return {
          label: 'Trễ giờ',
          sx: { bgcolor: '#fef3c7', color: '#d97706', fontWeight: 600 },
        };
      case 'cancelled':
        return {
          label: 'Đã hủy',
          sx: { bgcolor: '#fee2e2', color: '#ef4444', fontWeight: 600 },
        };
      default:
        return { label: status, sx: {} };
    }
  };


  return <Chip size="small" {...getStatusProps()} />;
};

const TripHistoryTable = ({ trips, onViewDetails }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [search, setSearch] = React.useState("");

  console.log('Trips in TripHistoryTable:', trips);
  const filteredRows = trips.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  return (
    <Paper
      elevation={3}
      sx={{
        height: "67vh",
        display: "flex",
        flexDirection: "column",
        p: 3,
        borderRadius: 3,
        backgroundColor: "#fff",
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Tìm kiếm chuyến đi..."
        fullWidth
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: "gray" }} />
            </InputAdornment>
          ),
        }}
      />
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: '1px solid #e5e7eb', borderRadius: 3, bgcolor: '#ffffff' }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: '#f9fafb' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>NGÀY</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>TUYẾN</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>GIỜ KHỞI HÀNH</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>GIỜ KẾT THÚC</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>TÌNH TRẠNG</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#6b7280', textAlign: 'center' }}>HÀNH ĐỘNG</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { bgcolor: '#f9fafb' },
                  }}
                >
                  <TableCell sx={{ fontWeight: 500, color: '#111827' }}>{row.date}</TableCell>
                  <TableCell>{row.route}</TableCell>
                  <TableCell>{row.startTime}</TableCell>
                  <TableCell>{row.endTime}</TableCell>
                  <TableCell>
                    <StatusChip status={row.status} />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => onViewDetails(row.id)}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        fontWeight: 600,
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

      </TableContainer>
      <Box
        sx={{
          mt: "auto",
          borderTop: "1px solid #e5e7eb",
          backgroundColor: "#f9fafb",
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        }}
      >
        <TablePagination
          component="div"
          count={filteredRows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang"
          sx={{
            "& .MuiTablePagination-toolbar": {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
            },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            {
              fontSize: "0.9rem",
            },
            "& .MuiTablePagination-actions button": {
              color: "#2563eb",
              borderRadius: "50%",
              border: "1px solid #2563eb30",
              width: 32,
              height: 32,
              margin: "0 4px",
              transition: "0.2s",
              "&:hover": {
                backgroundColor: "#2563eb15",
              },
            },
          }}
        />
      </Box>
    </Paper>


  );
};

export default TripHistoryTable;