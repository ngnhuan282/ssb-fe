import React from "react";
import { Box, Typography, Button, CircularProgress, Alert, Card, CardContent } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useFetch from "../../hooks/useFetch";
import { routeAPI } from "../../services/api";
import RouteTable from "../../components/admin/route/RouteTable";

const RoutePage = () => {
  const { data: routes, loading, error, refetch } = useFetch(routeAPI.getAll);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>🚌 Quản lý tuyến đường</Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="subtitle1">Danh sách các tuyến đường</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>Thêm tuyến đường</Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">Lỗi tải dữ liệu: {error.message}</Alert>}

      {!loading && !error && routes && (
        <Card>
          <CardContent>
            <RouteTable routes={routes} onRefresh={refetch} />
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default RoutePage;
