// src/components/admin/message/AdminMessageHistoryTable.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
  Box,
  TextField,
  TablePagination,
  InputAdornment,
} from "@mui/material";
import Search from "@mui/icons-material/Search";
import { notificationAPI } from "../../../services/api";

const AdminMessageHistoryTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await notificationAPI.getAll();
      const all = res.data.data || [];
      const msgs = all.filter((n) => n.type === "message");
      setData(msgs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  if (loading)
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress color="error" />
      </Box>
    );

  
  const filtered = data.filter((i) =>
    i.message.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper
      elevation={0}
      sx={{ border: "1px solid #e5e7eb", borderRadius: 3, p: 2 }}
    >
      <TextField
        variant="outlined"
        placeholder="Tìm kiếm nội dung..."
        fullWidth
        size="small"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(0);
        }}
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

      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: "#f9fafb" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, width: 120 }}>Loại</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 300 }}>Nội dung</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 150 }}> Người nhận</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 120 }}>Ngày gửi</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                  sx={{ py: 6, color: "#6b7280" }}
                >
                  Không có tin nhắn
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((msg) => (
                <TableRow key={msg._id}>
                  <TableCell sx={{ textTransform: "capitalize" }}>
                    {msg.type}
                  </TableCell>

                  <TableCell
                    sx={{
                      maxWidth: 420,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={msg.message}
                  >
                    {msg.message}
                  </TableCell>

                  <TableCell>
                    {msg.user && (msg.user.name || msg.user.username)
                      ? msg.user.name || msg.user.username
                      : Array.isArray(msg.recipients)
                      ? msg.recipients.length + " người"
                      : "Tất cả"}
                  </TableCell>

                  <TableCell>
                    {new Date(msg.createdAt).toLocaleString("vi-VN")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "end", mt: 1 }}>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 20, 50]}
          labelRowsPerPage="Số dòng mỗi trang"
        />
      </Box>
    </Paper>
  );
};

export default AdminMessageHistoryTable;
