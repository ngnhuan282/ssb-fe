import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
  Avatar,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person as StudentIcon,
  DirectionsBus as BusIcon,
  DriveEta as DriverIcon,
  Route as RouteIcon,
  Schedule as ScheduleIcon,
  Message as MessageIcon,
  Notifications as NotificationIcon,
  TrendingUp,
  Warning,
} from "@mui/icons-material";

const drawerWidth = 260;

const menuItems = [
  { text: "Tổng quan", icon: <DashboardIcon />, active: true },
  { text: "Học sinh", icon: <StudentIcon />, active: false },
  { text: "Tài xế", icon: <DriverIcon />, active: false },
  { text: "Xe buýt", icon: <BusIcon />, active: false },
  { text: "Tuyến đường", icon: <RouteIcon />, active: false },
  { text: "Lịch trình", icon: <ScheduleIcon />, active: false },
  { text: "Tin nhắn", icon: <MessageIcon />, active: false },
];

const statsData = [
  {
    title: "Tổng học sinh",
    value: 2500,
    icon: <StudentIcon />,
    color: "#007bff",
    change: "+5.2%",
  },
  {
    title: "Tổng tài xế",
    value: 50,
    icon: <DriverIcon />,
    color: "#28a745",
    change: "+2.1%",
  },
  {
    title: "Tổng xe buýt",
    value: 25,
    icon: <BusIcon />,
    color: "#ffc107",
    change: "0%",
  },
  {
    title: "Tuyến đường",
    value: 250,
    icon: <RouteIcon />,
    color: "#dc3545",
    change: "+1",
  },
];

const recentActivities = [
  {
    id: 1,
    type: "warning",
    message: "Xe 01 chậm 15 phút",
    time: "5 phút trước",
  },
  {
    id: 2,
    type: "success",
    message: "Học sinh Hello đã lên xe",
    time: "10 phút trước",
  },
  {
    id: 3,
    type: "info",
    message: "Tài xế Xin chào đã hoàn thành tuyến",
    time: "25 phút trước",
  },
  {
    id: 4,
    type: "error",
    message: "Xe 05 báo sự cố kỹ thuật",
    time: "1 giờ trước",
  },
];

const runningBuses = [
  {
    id: "01",
    plate: "29A-12345",
    driver: "Trần Văn Bảo",
    route: "Tuyến 1",
    students: 25,
    status: "Đang chạy",
  },
  {
    id: "02",
    plate: "29B-67890",
    driver: "Lê Thị Cún",
    route: "Tuyến 2",
    students: 22,
    status: "Đang chạy",
  },
  {
    id: "03",
    plate: "29C-11111",
    driver: "Phạm Văn Danh",
    route: "Tuyến 3",
    students: 18,
    status: "Dừng đỗ",
  },
];

const AdminDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f5f6fa" }}>
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#fff",
          color: "#333",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Toolbar>
          <BusIcon sx={{ fontSize: 32, color: "#007bff", mr: 1.5 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#007bff" }}>
              SSB Admin Panel
            </Typography>
            <Typography variant="caption" sx={{ color: "#6c757d" }}>
              Hệ thống quản trị xe buýt trường học
            </Typography>
          </Box>

          <IconButton sx={{ mr: 2 }}>
            <Badge badgeContent={5} color="error">
              <NotificationIcon />
            </Badge>
          </IconButton>

          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#007bff",
              cursor: "pointer",
            }}
          >
            AD
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#2c3e50",
            color: "#fff",
            borderRight: "none",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", mt: 2, px: 1 }}>
          <List>
            {menuItems.map((item, index) => (
              <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  selected={selectedMenu === index}
                  onClick={() => setSelectedMenu(index)}
                  sx={{
                    borderRadius: 2,
                    color: "#fff",
                    "&.Mui-selected": {
                      backgroundColor: "#007bff",
                      "&:hover": {
                        backgroundColor: "#0056b3",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, mt: 8, overflowY: "auto" }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 3, color: "#2c3e50" }}
        >
          📊 Tổng quan hệ thống
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statsData.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
                  color: "#fff",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Box>{stat.icon}</Box>
                    <Chip
                      label={stat.change}
                      size="small"
                      icon={<TrendingUp sx={{ fontSize: 14 }} />}
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.2)",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2">{stat.title}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2.5, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "#2c3e50" }}
              >
                🚌 Xe đang hoạt động
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Mã xe</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Biển số</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Tài xế</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Tuyến</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>HS</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {runningBuses.map((bus) => (
                      <TableRow key={bus.id} hover>
                        <TableCell>Xe {bus.id}</TableCell>
                        <TableCell>{bus.plate}</TableCell>
                        <TableCell>{bus.driver}</TableCell>
                        <TableCell>{bus.route}</TableCell>
                        <TableCell>{bus.students}</TableCell>
                        <TableCell>
                          <Chip
                            label={bus.status}
                            size="small"
                            color={
                              bus.status === "Đang chạy" ? "success" : "warning"
                            }
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2.5, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "#2c3e50" }}
              >
                🔔 Hoạt động gần đây
              </Typography>
              <List sx={{ p: 0 }}>
                {recentActivities.map((activity) => (
                  <ListItem
                    key={activity.id}
                    sx={{
                      px: 0,
                      py: 1.5,
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {activity.type === "warning" && (
                        <Warning color="warning" />
                      )}
                      {activity.type === "success" && (
                        <TrendingUp color="success" />
                      )}
                      {activity.type === "info" && (
                        <NotificationIcon color="info" />
                      )}
                      {activity.type === "error" && <Warning color="error" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.message}
                      secondary={activity.time}
                      primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: 11 }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
