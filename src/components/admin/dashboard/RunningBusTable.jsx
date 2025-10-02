import React from "react";
import { Paper, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip } from "@mui/material";

const RunningBusTable = ({ buses }) => (
  <Paper sx={{ p: 2.5 }}>
    <Typography variant="h6" fontWeight={600} mb={2}>🚌 Xe đang hoạt động</Typography>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mã xe</TableCell><TableCell>Biển số</TableCell>
            <TableCell>Tài xế</TableCell><TableCell>Tuyến</TableCell>
            <TableCell>HS</TableCell><TableCell>Trạng thái</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {buses.map((bus) => (
            <TableRow key={bus.id} hover>
              <TableCell>Xe {bus.id}</TableCell>
              <TableCell>{bus.plate}</TableCell>
              <TableCell>{bus.driver}</TableCell>
              <TableCell>{bus.route}</TableCell>
              <TableCell>{bus.students}</TableCell>
              <TableCell>
                <Chip label={bus.status} size="small"
                  color={bus.status === "Đang chạy" ? "success" : "warning"} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

export default RunningBusTable;
