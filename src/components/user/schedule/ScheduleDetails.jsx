// src/components/driver/schedule/ScheduleDetails.jsx
import React from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Route,
  AccessTime,
  TimerOff,
  RadioButtonUnchecked,
  CheckCircle,
  LocationOn,
} from "@mui/icons-material";

// Hàm helper để định dạng ngày
const formatSelectedDate = (date) => {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

// Hàm helper để render icon điểm dừng
const getStopIcon = (status) => {
  if (status === "completed") {
    return <CheckCircle sx={{ color: "text.secondary", fontSize: 20 }} />;
  }
  if (status === "current") {
    return <LocationOn sx={{ color: "primary.main", fontSize: 20 }} />;
  }
  return <RadioButtonUnchecked sx={{ color: "text.secondary", fontSize: 20 }} />;
};

const ScheduleDetails = ({ selectedDate, schedule }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #e0e0e0",
        p: 3,
        height: "100%",
        background: "#fff",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        {formatSelectedDate(selectedDate)}
      </Typography>

      {schedule ? (
        <>
          {/* Thông tin chuyến */}
          <Box sx={{ mb: 2 }}>
            <ListItem sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 40, color: "primary.main" }}>
                <Route />
              </ListItemIcon>
              <ListItemText
                primary="Tuyến đường"
                secondary={schedule.route}
                primaryTypographyProps={{
                  variant: "body2",
                  color: "text.secondary",
                }}
                secondaryTypographyProps={{
                  fontWeight: 500,
                  color: "text.primary",
                }}
              />
            </ListItem>
            <ListItem sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 40, color: "primary.main" }}>
                <AccessTime />
              </ListItemIcon>
              <ListItemText
                primary="Thời gian bắt đầu"
                secondary={schedule.startTime}
                primaryTypographyProps={{
                  variant: "body2",
                  color: "text.secondary",
                }}
                secondaryTypographyProps={{
                  fontWeight: 500,
                  color: "text.primary",
                }}
              />
            </ListItem>
            <ListItem sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 40, color: "primary.main" }}>
                <TimerOff />
              </ListItemIcon>
              <ListItemText
                primary="Thời gian kết thúc"
                secondary={schedule.endTime}
                primaryTypographyProps={{
                  variant: "body2",
                  color: "text.secondary",
                }}
                secondaryTypographyProps={{
                  fontWeight: 500,
                  color: "text.primary",
                }}
              />
            </ListItem>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Các điểm dừng */}
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              Các điểm dừng chính
            </Typography>
            <List dense>
              {schedule.stops.map((stop, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {getStopIcon(stop.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={stop.name}
                    primaryTypographyProps={{
                      color:
                        stop.status === "current"
                          ? "primary.main"
                          : "text.primary",
                      fontWeight: stop.status === "current" ? 600 : 400,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </>
      ) : (
        <Typography sx={{ color: "text.secondary", textAlign: "center", mt: 4 }}>
          Không có lịch trình cho ngày này.
        </Typography>
      )}
    </Paper>
  );
};

export default ScheduleDetails;