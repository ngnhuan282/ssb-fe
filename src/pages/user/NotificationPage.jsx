import React from "react";
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
} from "@mui/material";
import { Warning, Schedule, Info, CheckCircle } from "@mui/icons-material";

// Dữ liệu giả cho thông báo
const mockNotifications = [
  {
    id: 1,
    type: "incident",
    icon: <Warning />,
    color: "error", // Sẽ khớp với màu đỏ/cam
    title: "Sự cố được báo cáo: Tai nạn",
    description: "Tài xế Nguyễn Văn A (Xe 51A-12345) đã báo cáo sự cố.",
    time: "5 phút trước",
    unread: true,
  },
  {
    id: 2,
    type: "delay",
    icon: <Schedule />,
    color: "warning", // Sẽ khớp với màu vàng
    title: "Xe buýt đến trễ (Tuyến 02)",
    description: "Xe 51B-67890 dự kiến trễ 15 phút do tắc đường.",
    time: "1 giờ trước",
    unread: true,
  },
  {
    id: 3,
    type: "info",
    icon: <Info />,
    color: "primary", // Sẽ khớp với màu xanh dương
    title: "Cập nhật lịch trình",
    description: "Lịch trình cho tuần sau đã được cập nhật.",
    time: "Hôm qua lúc 15:30",
    unread: false,
  },
  {
    id: 4,
    type: "success",
    icon: <CheckCircle />,
    color: "success", // Sẽ khớp với màu xanh lá
    title: "Học sinh đã lên xe",
    description: "Bé Nguyễn Minh Khang đã được đón lên xe 51B-67890 an toàn.",
    time: "Hôm qua lúc 07:15",
    unread: false,
  },
];

const NotificationPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Thông báo
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 0, // Đặt p=0 để List chiếm trọn Paper
          display: "flex",
          flexDirection: "column",
        }}
      >
        {mockNotifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              Hiện tại chưa có thông báo nào.
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: "100%", padding: 0 }}>
            {mockNotifications.map((noti, index) => (
              <React.Fragment key={noti.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    // Dùng màu nền nhẹ để phân biệt thông báo CHƯA ĐỌC
                    bgcolor: noti.unread ? "action.hover" : "transparent",
                    py: 2,
                    px: 3,
                  }}
                >
                  <ListItemAvatar sx={{ mt: 0.5 }}>
                    <Avatar
                      sx={{
                        // Dùng màu .light để làm nền
                        bgcolor: `${noti.color}.light`,
                        // Dùng màu .main để làm màu icon
                        color: `${noti.color}.main`,
                      }}
                    >
                      {noti.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        fontWeight={noti.unread ? 600 : 500} // In đậm title nếu chưa đọc
                      >
                        {noti.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          sx={{ display: "block" }}
                        >
                          {noti.description}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {noti.time}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {/* Thêm đường phân cách, trừ item cuối cùng */}
                {index < mockNotifications.length - 1 && (
                  <Divider component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default NotificationPage;
