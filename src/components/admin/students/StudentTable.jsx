import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Paper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function StudentTable({
  rows,
  students,
  paginationModel,
  setPaginationModel,
  onEdit,
  onDelete,
}) {
  const columns = [
    { field: "fullName", headerName: "Họ Tên", flex: 1, minWidth: 180 },
    { field: "age", headerName: "Tuổi", flex: 0.5, minWidth: 60 },
    { field: "class", headerName: "Lớp", flex: 0.7, minWidth: 70 },
    { field: "parent", headerName: "Mã Phụ Huynh", flex: 1, minWidth: 180 },
    { field: "route", headerName: "Tuyến Đường", flex: 1, minWidth: 200 },
    { field: "pickupPoint", headerName: "Điểm Đón", flex: 1, minWidth: 200 },
    { field: "dropoffPoint", headerName: "Điểm Trả", flex: 1, minWidth: 200 },
    { field: "status", headerName: "Trạng Thái", flex: 1, minWidth: 100 },
    { field: "createdAt", headerName: "Ngày Tạo", flex: 1, minWidth: 100 },
    { field: "updatedAt", headerName: "Ngày Cập Nhật", flex: 1, minWidth: 100 },
    {
      field: "actions",
      headerName: "Hành Động",
      flex: 1,
      sortable: false,
      minWidth: 100,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => onEdit(students.find((s) => s._id === params.row.id))}
            sx={{ color: "#007bff" }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => onDelete(students.find((s) => s._id === params.row.id))}
            sx={{ color: "#dc3545" }}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Paper sx={{ height: "67vh", borderRadius: 2, overflow: "auto" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 8, 10, 20]}
        pagination
        disableRowSelectionOnClick
        sx={{
          backgroundColor: "#fff",
          border: "none",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
            outline: "none",
          },
        }}
      />
    </Paper>
  );
}
