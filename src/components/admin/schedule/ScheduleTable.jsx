import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Stack } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function ScheduleTable({ schedules, onEdit, onDelete }) {
    const columns = [
        { field: "route", headerName: "Tuyến", flex: 1 },
        { field: "bus", headerName: "Xe", flex: 1 },
        { field: "driver", headerName: "Tài xế", flex: 1 },
        { field: "date", headerName: "Ngày", flex: 1, },
        { field: "starttime", headerName: "Bắt đầu", flex: 1, },
        { field: "endtime", headerName: "Kết thúc", flex: 1, },
        { field: "numstudent", headerName: "Số lượng học sinh", flex: 1, },
        { field: "frequency", headerName: "Tần suất", flex: 1, },
        { field: "status", headerName: "Trạng thái", flex: 1, },
        { field: "createdAt", headerName: "CreatedAt", flex: 1, },
        { field: "updatedAt", headerName: "UpdatedAt", flex: 1, },
        {
            field: "actions",
            headerName: "Thao tác",
            flex: 1,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <Button
                        size="small"
                        color="primary"
                        variant="outlined"
                        onClick={() => onEdit(params.row)}
                        startIcon={<Edit />}
                    >
                        Sửa
                    </Button>
                    <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => onDelete(params.row._id)}
                        startIcon={<Delete />}
                    >
                        Xóa
                    </Button>
                </Stack>
            ),
        },
    ];

    return (
        <DataGrid
            rows={schedules || []}
            columns={columns}
            getRowId={(row) => row._id}
            pageSize={5}
            disableRowSelectionOnClick
            sx={{ backgroundColor: "white" }}
        />
    );
}