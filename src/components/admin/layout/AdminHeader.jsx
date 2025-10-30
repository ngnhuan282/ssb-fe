import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Avatar,
  Breadcrumbs,
  Link,
  Fade,
} from "@mui/material";
import {
  DirectionsBus as BusIcon,
  Notifications as NotificationIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

// 🔹 Map slug -> tiếng Việt
const breadcrumbMap = {
  admin: "Dashboard",
  students: "Học sinh",
  drivers: "Tài xế",
  buses: "Xe buýt",
  routes: "Tuyến đường",
  schedule: "Lịch trình",
  notifications: "Thông báo",
  settings: "Cài đặt",
};

const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (t) => t.zIndex.drawer + 1,
        height: "80px",
        backgroundColor: "#fff",
        color: "#111827",
        boxShadow: "0 2px 0 rgba(0,0,0,0.05)",
        justifyContent: "center",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 4,
        }}
      >
        {/* Logo bên trái */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BusIcon sx={{ fontSize: 36, color: "#007bff" }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#007bff",
              fontFamily: "Poppins, sans-serif",
              letterSpacing: 0.5,
            }}
          >
            SSB
          </Typography>
        </Box>

        <Fade in={true} timeout={300} key={location.pathname}>
          <Box
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#007bff",
                fontSize: "1.6rem",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Hệ thống quản trị xe buýt trường học
            </Typography>

            <Breadcrumbs
              separator="›"
              aria-label="breadcrumb"
              sx={{
                fontSize: "1.25rem",
                fontWeight: 700,
                mt: 0.5,
                "& .MuiBreadcrumbs-separator": { color: "#9ca3af", mx: 1 },
                "& a": {
                  color: "#374151",
                  textDecoration: "none",
                  "&:hover": { color: "#007bff" },
                },
              }}
            >
              <Link
                onClick={() => navigate("/admin")}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                <HomeIcon sx={{ mr: 0.6, fontSize: 22 }} />
                Tổng quan
              </Link>

              {pathnames.slice(1).map((value, index) => {
                const to = `/${pathnames.slice(0, index + 2).join("/")}`;
                const isLast = index === pathnames.length - 2;
                const label = breadcrumbMap[value] || value;

                return isLast ? (
                  <Typography
                    key={to}
                    color="#007bff"
                    fontWeight={700}
                    fontSize="1.25rem"
                  >
                    {label}
                  </Typography>
                ) : (
                  <Link
                    key={to}
                    onClick={() => navigate(to)}
                    sx={{ cursor: "pointer", fontWeight: 700 }}
                  >
                    {label}
                  </Link>
                );
              })}
            </Breadcrumbs>
          </Box>
        </Fade>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton>
            <Badge badgeContent={3} color="error">
              <NotificationIcon />
            </Badge>
          </IconButton>
          <Avatar sx={{ width: 42, height: 42, bgcolor: "#007bff" }}>AD</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
