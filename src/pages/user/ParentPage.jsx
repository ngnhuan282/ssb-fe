import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Stack,
  Chip,
  Divider,
  Container,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { parentAPI, notificationAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ParentPage = () => {
  const { user } = useAuth();

  const [parentData, setParentData] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const [loadingParent, setLoadingParent] = useState(true);
  const [loadingNotif, setLoadingNotif] = useState(false);
  const [error, setError] = useState("");

  const fetchParentProfile = async () => {
    if (!user) return;
    try {
      setLoadingParent(true);
      const res = await parentAPI.getAll();
      const allParents = res.data.data || [];
      const myProfile = allParents.find(
        (p) => p.user._id === user._id || p.user === user._id
      );

      if (myProfile) {
        setParentData(myProfile);
      }
    } catch (err) {
      console.error("Lỗi lấy profile phụ huynh:", err);
      setError("Không thể tải thông tin hồ sơ.");
    } finally {
      setLoadingParent(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoadingNotif(true);
      const res = await notificationAPI.getMyNotifications();
      if (res.data && res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error("Lỗi lấy thông báo:", err);
    } finally {
      setLoadingNotif(false);
    }
  };

  useEffect(() => {
    fetchParentProfile();
    fetchNotifications();
  }, [user]);

  const handleRefresh = () => {
    fetchParentProfile();
    fetchNotifications();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* --- HEADER & NÚT REFRESH --- */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" color="#1e293b">
            Trang Phụ Huynh
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cập nhật thông tin đưa đón học sinh
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loadingNotif}
        >
          {loadingNotif ? "Đang tải..." : "Làm mới"}
        </Button>
      </Box>

      {/* --- PHẦN 1: DANH SÁCH CẢNH BÁO (QUAN TRỌNG NHẤT) --- */}
      <Card sx={{ mb: 4, border: "1px solid #e2e8f0", boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <NotificationsActiveIcon color="error" />
            <Typography variant="h6" fontWeight="bold" color="#dc2626">
              Bảng Tin & Cảnh Báo Mới
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />

          {loadingNotif ? (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress size={24} />
            </Box>
          ) : notifications.length === 0 ? (
            <Alert severity="success">
              Hiện tại mọi thứ ổn định, chưa có thông báo mới.
            </Alert>
          ) : (
            <Stack spacing={2}>
              {notifications.map((notif) => (
                <Alert
                  key={notif._id}
                  severity={notif.type === "emergency" ? "error" : "info"} // Đỏ nếu khẩn cấp, Xanh nếu thường
                  variant={notif.type === "emergency" ? "filled" : "standard"}
                  icon={
                    notif.type === "emergency" ? (
                      <Warning fontSize="inherit" />
                    ) : (
                      <DirectionsBusIcon fontSize="inherit" />
                    )
                  }
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    {notif.emergency_type || "Thông báo từ tài xế"}
                  </Typography>
                  <Typography variant="body2">{notif.message}</Typography>
                  <Box
                    mt={1}
                    display="flex"
                    gap={2}
                    fontSize="0.75rem"
                    opacity={0.9}
                  >
                    {notif.location && <span>📍 {notif.location}</span>}
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <AccessTimeIcon fontSize="inherit" />
                      {new Date(notif.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </Box>
                </Alert>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* --- PHẦN 2: THÔNG TIN HỒ SƠ --- */}
      {loadingParent ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : parentData ? (
        <Card variant="outlined">
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <PersonIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Thông Tin Của Tôi
              </Typography>
            </Box>

            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
              gap={2}
            >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Tài khoản
                </Typography>
                <Typography fontWeight="500">{user?.username}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Số điện thoại
                </Typography>
                <Typography fontWeight="500">
                  {user?.phone || "Chưa cập nhật"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Điểm đón đăng ký
                </Typography>
                <Typography fontWeight="500">
                  {parentData.pickupPoint}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Điểm trả đăng ký
                </Typography>
                <Typography fontWeight="500">
                  {parentData.dropoffPoint}
                </Typography>
              </Box>
            </Box>

            <Box mt={3}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mb={1}
              >
                Danh sách học sinh
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {parentData.children?.map((child, index) => (
                  <Chip
                    key={index}
                    label={
                      typeof child === "object"
                        ? child.fullName
                        : "Học sinh " + (index + 1)
                    }
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Alert severity="warning">
          Không tìm thấy dữ liệu phụ huynh. Vui lòng liên hệ nhà trường.
        </Alert>
      )}
    </Container>
  );
};

export default ParentPage;
