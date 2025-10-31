import React from "react";
import { DataGrid } from "@mui/x-data-grid";
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
  Button
} from "@mui/material";
import { Edit, Delete, Search, FormatListBulleted } from "@mui/icons-material";

export default function RouteTable({
  rows,
  routes,
  onEdit,
  onDelete,
  onViewStops,
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);
  const [search, setSearch] = React.useState("");

  const columns = [
    { field: "name", headerName: "Tên Tuyến", flex: 1},
    { field: "distance", headerName: "Quãng đường", flex: 1},
    { field: "estimatedTime", headerName: "Thời gian dự kiến", flex: 1},
    { field: "assignedBus", headerName: "Xe phụ trách", flex: 1},
    { field: "createdAt", headerName: "Ngày tạo", flex: 1},
    { field: "updatedAt", headerName: "Ngày cập nhật", flex: 1},
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
        placeholder="Tìm kiếm tuyến đường..."
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
                <TableCell key={col.field} sx={{ fontWeight: "bold"}}> {/* them colminwidth de co the ap dung minwidth o tren  */}
                  {col.headerName}
                </TableCell>
              ))}
              {onViewStops && <TableCell sx={{  width: "80px",  whiteSpace: "nowrap" ,fontWeight: "bold" }}>Điểm dừng</TableCell>}
              {(onEdit || onDelete) && <TableCell sx={{ width: "80px",  whiteSpace: "nowrap" , pl:3 , fontWeight: "bold" }}>Thao tác</TableCell>}  {/* them pl3 can giua thao tac */}
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
                    <TableCell key={col.field}>{row[col.field]}</TableCell> // them colminwidth de co the ap dung minwidth o tren 
                  ))}
                  {onViewStops && (
                    <TableCell direction="row">
                        <Button
                            size="small"
                            onClick={() => onViewStops(row)}
                        >
                            <FormatListBulleted />
                        </Button>
                    </TableCell>
                  )}
                  {(onEdit || onDelete) && (
                    <TableCell >
                      <Stack direction="row" spacing={1}>
                        {onEdit && (
                          <IconButton color="primary" onClick={() => onEdit(routes.find((r) => r._id === row.id))}>
                            <Edit fontSize="small" />
                          </IconButton>
                        )}
                        {onDelete && (
                          <IconButton color="error" onClick={() => onDelete(routes.find((r) => r._id === row.id))}>
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
          rowsPerPageOptions={[6, 10, 25, 50 ,100]}   
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
