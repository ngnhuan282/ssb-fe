import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Box, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DriverTable({
  rows,
  paginationModel,
  setPaginationModel,
  onEdit,
  onDelete,
}) {
  const columns = [
    { field: "fullName", headerName: "Họ và tên", flex: 1.2, minWidth: 180 },
    { field: "phoneNumber", headerName: "Số điện thoại", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Địa chỉ email", flex: 1, minWidth: 150 },
    { field: "licenseNumber", headerName: "Số bằng lái", flex: 1, minWidth: 150 },
    { field: "assignedBus", headerName: "Xe bus đăng ký", flex: 1, minWidth: 150 },
    { field: "status", headerName: "Trạng thái", flex: 1, minWidth: 130 },
    { field: "createdAt", headerName: "Ngày tạo", flex: 1, minWidth: 160 },
    { field: "updatedAt", headerName: "Cập nhật", flex: 1, minWidth: 160 },
    {
      field: "actions",
      headerName: "Hành động",
      flex: 0.8,
      minWidth: 130,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Chỉnh sửa">
            <IconButton
              color="primary"
              size="large"
              onClick={() => onEdit(params.row)}
            >
              <EditIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton
              color="error"
              size="large"
              onClick={() => onDelete(params.row)}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        height: "calc(100vh - 220px)", // chiếm gần hết chiều cao màn hình
        width: "100%",
        bgcolor: "background.paper",
        p: 3,
        borderRadius: 3,
        boxShadow: 4,
        overflow: "hidden",
      }}
    >
      <DataGrid
        rows={rows}
        getRowId={(row) => row.id || row._id}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        autoHeight={false}
        sx={{
          fontSize: "1rem",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#1976d2",
            color: "#000000ff",
            fontWeight: "bold",
            fontSize: "0.95rem",
          },
          "& .MuiDataGrid-cell": {
            py: 2,
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.05)",
          },
          "& .MuiTablePagination-root": {
            fontSize: "0.9rem",
          },
        }}
      />
    </Box>
  );
}
