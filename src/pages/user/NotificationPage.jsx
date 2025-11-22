import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  Warning,
  Schedule,
  Info,
  CheckCircle,
  NotificationsActive,
} from "@mui/icons-material";
import { notificationAPI } from "../../services/api";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = "6910388ff1c1fce244797451";

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationAPI.getMyNotifications(currentUserId);
        if (res.data && res.data.data) {
          setNotifications(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi tải thông báo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [currentUserId]);

  const getNotificationStyle = (noti) => {
    const type = noti.type;
    if (type === "emergency" || type === "urgent") {
      return {
        icon: <Warning />,
        color: "error",
        titlePrefix: noti.emergency_type || "Cảnh báo khẩn cấp",
      };
    }
    if (type === "delay") {
      return {
        icon: <Schedule />,
        color: "warning",
        titlePrefix: "Thông báo trễ chuyến",
      };
    }
    if (["arrival", "boarded", "offboard"].includes(type)) {
      return {
        icon: <CheckCircle />,
        color: "success",
        titlePrefix: "Cập nhật hành trình",
      };
    }
    return { icon: <Info />, color: "info", titlePrefix: "Thông tin chung" };
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h4" component="h1">
          Thông báo của bạn
        </Typography>
        <Chip
          label={`${notifications.length} tin mới`}
          color="primary"
          size="small"
        />
      </Box>

      <Paper
        sx={{ p: 0, display: "flex", flexDirection: "column", minHeight: 300 }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
              p: 5,
            }}
          >
            <CircularProgress />
          </Box>
        ) : notifications.length === 0 ? (
          <Box
            sx={{
              p: 5,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <NotificationsActive
              sx={{ fontSize: 60, color: "#e0e0e0", mb: 2 }}
            />
            <Typography variant="body1" color="text.secondary">
              Hiện tại chưa có thông báo nào.
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: "100%", padding: 0 }}>
            {notifications.map((noti, index) => {
              const style = getNotificationStyle(noti);
              return (
                <React.Fragment key={noti._id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      bgcolor: !noti.read
                        ? "rgba(25, 118, 210, 0.04)"
                        : "transparent",
                      transition: "0.3s",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.02)" },
                      py: 2,
                      px: 3,
                    }}
                  >
                    <ListItemAvatar sx={{ mt: 0.5 }}>
                      <Avatar
                        sx={{
                          bgcolor: `${style.color}.light`,
                          color: `${style.color}.main`,
                        }}
                      >
                        {style.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          fontWeight={!noti.read ? 600 : 500}
                        >
                          {style.titlePrefix}
                          {noti.busId && (
                            <Typography
                              component="span"
                              variant="caption"
                              sx={{
                                ml: 1,
                                bgcolor: "#eee",
                                px: 1,
                                borderRadius: 1,
                              }}
                            >
                              Xe: {noti.busId?.licensePlate || "Bus"}
                            </Typography>
                          )}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            sx={{ display: "block", mb: 0.5 }}
                          >
                            {noti.message}
                          </Typography>
                          {noti.location && (
                            <Typography
                              variant="caption"
                              display="block"
                              color="text.secondary"
                            >
                              📍 {noti.location}
                            </Typography>
                          )}
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontStyle: "italic" }}
                          >
                            {noti.createdAt
                              ? formatDistanceToNow(new Date(noti.createdAt), {
                                  addSuffix: true,
                                  locale: vi,
                                })
                              : "Vừa xong"}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < notifications.length - 1 && (
                    <Divider component="li" />
                  )}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default NotificationPage;
