import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import useFetch from "../../hooks/useFetch";
import { parentAPI } from "../../services/api";

const ParentPage = () => {
  const {
    data: parentData,
    loading,
    error,
    refetch,
  } = useFetch(parentAPI.getCurrentParent);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        👨‍👩‍👧 Phụ huynh
      </Typography>

      <Typography variant="body1" sx={{ color: "text.secondary" }}>
        Theo dõi thông tin học sinh và xe buýt đưa đón
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error">
          Lỗi khi tải thông tin phụ huynh: {error.message || "Không xác định"}
        </Alert>
      )}

      {!loading && !error && parentData && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              👩‍💼 Thông tin phụ huynh
            </Typography>
            <Typography><b>Tài khoản:</b> {parentData.user}</Typography>
            <Typography><b>Điểm đón:</b> {parentData.pickupPoint}</Typography>
            <Typography><b>Điểm trả:</b> {parentData.dropoffPoint}</Typography>

            <Typography variant="h6" mt={3}>
              🎒 Danh sách học sinh
            </Typography>
            <ul>
              {parentData.children?.map((child, i) => (
                <li key={i}>{child}</li>
              ))}
            </ul>

            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={refetch}
              sx={{ mt: 2 }}
            >
              Làm mới dữ liệu
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🚌 Vị trí xe buýt hiện tại
          </Typography>
          <Typography color="text.secondary">
            (Tính năng theo dõi thời gian thực đang được phát triển...)
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ParentPage;
