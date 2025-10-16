import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Paper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function BusTable({
  rows,
  buses,
  paginationModel,
  setPaginationModel,
  onEdit,
  onDelete,
}) {
  const columns = [
    { field: "licensePlate", headerName: "Biển Số", flex: 1, minWidth: 120 },
    { field: "capacity", headerName: "Sức Chứa", flex: 1, minWidth: 100 },
    { field: "currentStatus", headerName: "Trạng Thái", flex: 1, minWidth: 130 },
    { field: "driver", headerName: "Tài Xế", flex: 1, minWidth: 130 },
    { field: "route", headerName: "Tuyến Đường", flex: 1, minWidth: 200 },
    { field: "createdAt", headerName: "Ngày Tạo", flex: 1, minWidth: 120 },
    { field: "updatedAt", headerName: "Ngày Cập Nhật", flex: 1, minWidth: 120 },
    {
      field: "actions",
      headerName: "Hành Động",
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => onEdit(buses.find((b) => b._id === params.row.id))}
            sx={{ color: "#007bff" }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => onDelete(buses.find((b) => b._id === params.row.id))}
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
