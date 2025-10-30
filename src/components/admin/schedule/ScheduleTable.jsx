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
    Button
} from "@mui/material";
import { Edit, Delete, Search, FormatListBulleted } from "@mui/icons-material";

export default function ScheduleTable({ schedules, onEdit, onDelete, onViewStudents }) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [search, setSearch] = React.useState("");

    const columns = [
        { field: "route", headerName: "Tuyến", flex: 1 },
        { field: "bus", headerName: "Xe", flex: 1 },
        { field: "driver", headerName: "Tài xế", flex: 1 },
        { field: "date", headerName: "Ngày", flex: 1, },
        { field: "starttime", headerName: "Bắt đầu", flex: 1, },
        { field: "endtime", headerName: "Kết thúc", flex: 1, },
        { field: "frequency", headerName: "Tần suất", flex: 1, },
        { field: "status", headerName: "Trạng thái", flex: 1, },
        { field: "createdAt", headerName: "CreatedAt", flex: 1, },
        { field: "updatedAt", headerName: "UpdatedAt", flex: 1, },
    ];

    const filteredRows = schedules.filter((row) =>
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
                placeholder="Tìm kiếm lịch trình..."
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
                            {onViewStudents && <TableCell sx={{ fontWeight: "bold" }}>Học sinh</TableCell>}
                            {(onEdit || onDelete) && <TableCell sx={{ fontWeight: "bold" }}>Thao tác</TableCell>}
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
                                    {onViewStudents && (
                                        <TableCell direction="row">
                                            <Button
                                                size="small"
                                                onClick={() => onViewStudents(row)}
                                            >
                                                <FormatListBulleted />
                                            </Button>
                                        </TableCell>
                                    )}
                                    {(onEdit || onDelete) && (
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                {onEdit && (
                                                    <IconButton color="primary" onClick={() => onEdit(row)}>
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                )}
                                                {onDelete && (
                                                    <IconButton color="error" onClick={() => onDelete(row._id)}>
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