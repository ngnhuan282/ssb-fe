import {
  Person as StudentIcon,
  DirectionsBus as BusIcon,
  DriveEta as DriverIcon,
  Route as RouteIcon,
} from "@mui/icons-material";

export const statsData = [
  { title: "Tổng học sinh", value: 2500, icon: <StudentIcon />, color: "#007bff", change: "+5.2%" },
  { title: "Tổng tài xế", value: 50, icon: <DriverIcon />, color: "#28a745", change: "+2.1%" },
  { title: "Tổng xe buýt", value: 25, icon: <BusIcon />, color: "#ffc107", change: "0%" },
  { title: "Tuyến đường", value: 250, icon: <RouteIcon />, color: "#dc3545", change: "+1" },
];

export const recentActivities = [
  { id: 1, type: "warning", message: "Xe 01 chậm 15 phút", time: "5 phút trước" },
  { id: 2, type: "success", message: "Học sinh Hello đã lên xe", time: "10 phút trước" },
  { id: 3, type: "info", message: "Tài xế Xin chào đã hoàn thành tuyến", time: "25 phút trước" },
  { id: 4, type: "error", message: "Xe 05 báo sự cố kỹ thuật", time: "1 giờ trước" },
];

export const runningBuses = [
  { id: "01", plate: "29A-12345", driver: "Trần Văn Bảo", route: "Tuyến 1", students: 25, status: "Đang chạy" },
  { id: "02", plate: "29B-67890", driver: "Lê Thị Cún", route: "Tuyến 2", students: 22, status: "Đang chạy" },
  { id: "03", plate: "29C-11111", driver: "Phạm Văn Danh", route: "Tuyến 3", students: 18, status: "Dừng đỗ" },
];
