import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const RouteTable = ({ routes, onRefresh }) => {
  const columns = [
    { field: "id", headerName: "STT", width: 70 },
    { field: "name", headerName: "Tên tuyến", width: 200 },
    { field: "startPoint", headerName: "Điểm xuất phát", width: 200 },
    { field: "endPoint", headerName: "Điểm kết thúc", width: 200 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton color="primary">
            <EditIcon />
          </IconButton>
          <IconButton color="error">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = routes.map((route, index) => ({
    id: index + 1,
    ...route,
  }));

  return <DataGrid rows={rows} columns={columns} autoHeight pageSize={5} rowsPerPageOptions={[5]} />;
};

export default RouteTable;
