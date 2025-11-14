import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  TextField,
  Stack,
  Box,
  InputAdornment,
} from "@mui/material";
import { Edit, Delete, Search } from "@mui/icons-material";

export default function DriverTable({
  rows,
  onEdit,
  onDelete,
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);
  const [search, setSearch] = React.useState("");


  const columns = [
    { field: "fullName", headerName: "Họ và tên", flex: 1.2, minWidth: 180 },
    { field: "phoneNumber", headerName: "Số điện thoại", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Địa chỉ email", flex: 1, minWidth: 150 },
    { field: "licenseNumber", headerName: "Số bằng lái", flex: 1, minWidth: 150 },
    { field: "assignedBus", headerName: "Xe bus đăng ký", flex: 1, minWidth: 150 },
    { field: "status", headerName: "Trạng thái", flex: 1, minWidth: 130 },
    { field: "createdAt", headerName: "Ngày tạo", flex: 1, minWidth: 160 },
    { field: "updatedAt", headerName: "Cập nhật", flex: 1, minWidth: 160 },
    // {
    //   field: "actions",
    //   headerName: "Hành động",
    //   flex: 0.8,
    //   minWidth: 130,
    //   sortable: false,
    //   renderCell: (params) => (
    //     <Box sx={{ display: "flex", gap: 1 }}>
    //       <Tooltip title="Chỉnh sửa">
    //         <IconButton
    //           color="primary"
    //           size="large"
    //           onClick={() => onEdit(params.row)}
    //         >
    //           <EditIcon fontSize="inherit" />
    //         </IconButton>
    //       </Tooltip>
    //       <Tooltip title="Xóa">
    //         <IconButton
    //           color="error"
    //           size="large"
    //           onClick={() => onDelete(params.row)}
    //         >
    //           <DeleteIcon fontSize="inherit" />
    //         </IconButton>
    //       </Tooltip>
    //     </Box>
    //   ),
    // },
  ];
  const filteredRows = rows.filter((row) =>
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
        placeholder="Tìm kiếm tài xế..."
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
        sx={{
          borderRadius: 3,
        }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.field} sx={{ fontWeight: "bold" }}>
                  {col.headerName}
                </TableCell>
              ))}
              {(onEdit || onDelete) && <TableCell sx={{ width: "80px", whiteSpace: "nowrap", pl: 3, fontWeight: "bold" }}>Thao tác</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, idx) => (
                <TableRow key={idx} hover sx={{
                  backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
                  transition: "background-color 0.2s ease"
                }}>
                  {columns.map((col) => (
                    <TableCell key={col.field}>{row[col.field]}</TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {onEdit && (
                          <IconButton color="primary" onClick={() => onEdit(row)}>
                            <Edit fontSize="small" />
                          </IconButton>
                        )}
                        {onDelete && (
                          <IconButton color="error" onClick={() => onDelete(row)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </Stack>
                    </TableCell>
                  )}
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
          rowsPerPageOptions={[6, 10, 25, 50, 100]}
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
    </Paper >
  );
}
