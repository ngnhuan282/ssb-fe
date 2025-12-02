// src/pages/driver/DriverPickupPointPage.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  CircularProgress, 
  Typography,
  Snackbar,
  GlobalStyles,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Avatar  
} from '@mui/material';
import { School, Phone } from '@mui/icons-material';
import MapContainer from '../../components/user/pickup/MapContainer';
import PickupSidebar from '../../components/user/pickup/PickupSidebar';
import { useAuth } from '../../context/AuthContext';
import { scheduleAPI, stopAssignmentAPI, locationAPI } from '../../services/api';
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// --- HÀM HELPER: Tính góc quay (Bearing) ---
// Đặt hàm này ở ngoài component để tránh bị re-create
const getBearing = (startLat, startLng, destLat, destLng) => {
  const startLatRad = (startLat * Math.PI) / 180;
  const startLngRad = (startLng * Math.PI) / 180;
  const destLatRad = (destLat * Math.PI) / 180;
  const destLngRad = (destLng * Math.PI) / 180;

  const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
  const x = Math.cos(startLatRad) * Math.sin(destLatRad) -
            Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
};

// Hàm kiểm tra hoàn thành điểm dừng
const checkPointCompletion = (students) => {
  return students.every(s => s.status === 'boarded' || s.status === 'absent' || s.status === 'dropped_off');
};

const DriverPickupPointPage = () => {
  const [points, setPoints] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [busLocation, setBusLocation] = useState(null);
  const { user, driverId } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // State cho routing , running 
  const [routeStartPoint, setRouteStartPoint] = useState(null); 
  const [routeDestination, setRouteDestination] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [simulationIndex, setSimulationIndex] = useState(0);
  const simulationInterval = useRef(null); 

  // SOCKET
  const [socket, setSocket] = useState(null);

  // Dialog hoan thanh 
  const navigate = useNavigate();
  const [showFinishDialog, setShowFinishDialog] = useState(false);

  // --- 1. Fetch dữ liệu ---
  useEffect(()=>{
    if(!driverId || user?.role !== 'driver'){
      setIsLoading(false);
      return;
    }

    const fetchDriverData = async ()=>{
      setIsLoading(true);
      try{
        const scheduleRes = await scheduleAPI.getByDriver(driverId);
        // Lấy lịch trình đang chạy hoặc sắp tới
        const activeSchedule = (scheduleRes.data?.data || scheduleRes.data).find((s) => s.status === 'in_progress') || 
                               (scheduleRes.data?.data || scheduleRes.data).find((s) => s.status === 'scheduled');
        
        if (!activeSchedule) {
          throw new Error("Không tìm thấy lịch trình nào được gán.");
        }

        setSchedule(activeSchedule);
        const currentScheduleId = activeSchedule._id;
        const busId = activeSchedule.bus._id || activeSchedule.bus;

        // Lấy vị trí xe
        try {
          const locationRes = await locationAPI.getLatestByBus(busId);
          if (locationRes.data && locationRes.data.data) {
            const latestLocation = locationRes.data.data;
            setBusLocation({
              lat: latestLocation.latitude,
              lng: latestLocation.longitude
            });
          }
        } catch (locErr) {
          console.error("Lỗi khi lấy vị trí từ DB:", locErr.message);
        }

        // Lấy điểm dừng & học sinh
        const { route } = activeSchedule;
        if (!route || !route.stops || route.stops.length === 0) {
          throw new Error("Tuyến đường của lịch trình không có điểm dừng.");
        }

        const studentPromises = route.stops.map((stop, index)=> 
          stopAssignmentAPI.getStudentsByStop(currentScheduleId,index)
        );
        const studentResponses = await Promise.all(studentPromises);
        
        const finalPointsData = route.stops.map((stop, index) =>{
          const assignments = studentResponses[index].data?.data || studentResponses[index].data; 

          const students = assignments.map(assign => {
            let stopAssignmentStatus = assign.status;
            // Logic đồng bộ trạng thái (như code cũ của bạn)
            if ( assign.type === 'pickup' && stopAssignmentStatus === 'waiting' && assign.student.status === 'picked_up'){
              stopAssignmentStatus = 'boarded'; 
            }
            if ( assign.type === 'dropoff' && stopAssignmentStatus === 'waiting' && assign.student.status === 'dropped_off' ){
              stopAssignmentStatus = 'dropped_off';
            }
            if ( assign.type === 'pickup' && stopAssignmentStatus === 'boarded' && assign.student.status === 'pending' ){
              stopAssignmentStatus = 'waiting';
            }
            if ( (assign.type === 'dropoff' && stopAssignmentStatus === 'dropped_off' && assign.student.status === 'picked_up') || assign.student.status === 'pending'){
              stopAssignmentStatus = 'waiting';
            }

            const parentPhone = assign.student.parent?.user?.phone || "Chưa cập nhật";
            const studentClass = assign.student.class || "Chưa cập nhật";
            
            return {
              id: assign.student._id,
              assignmentId: assign._id,
              name: assign.student.fullName, 
              phone: parentPhone,
              class: studentClass,
              status: stopAssignmentStatus,
              type: assign.type,
            };
          });

          return {
            id: `stop_${index}`,
            stopIndex: index,
            name: stop.location,
            position: {
              lat: stop.latitude,
              lng: stop.longitude
            },
            studentCount: students.length,
            status: checkPointCompletion(students) ? 'completed' : 'pending',
            students: students,
          };
        });
        setPoints(finalPointsData);
      } catch(err){
        console.error("Fetch data error:", err);
        showNotification(`Lỗi tải dữ liệu: ${err.message || 'Server error'}`, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDriverData();
  },[driverId, user]);

  // --- 2. Kết nối Socket ---
  useEffect(() => {
    if (!schedule) return;
    
    const socketConnection = io(SOCKET_URL);
    setSocket(socketConnection);

    socketConnection.on('connect', () => {
      console.log(`Socket: Đã kết nối với ID ${socketConnection.id}`);
      socketConnection.emit('joinScheduleRoom', schedule._id);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [schedule]);

  // --- 3. Logic Giả lập Di chuyển (CÓ SỬ DỤNG getBearing) ---
  const handleRouteFound = useCallback((coordinates) => {
    console.log("Đã tìm thấy tuyến đường với", coordinates.length, "điểm.");
    setRouteCoordinates(coordinates);
    setSimulationIndex(0); 
    if (coordinates.length > 0) {
      setBusLocation(coordinates[0]);
    }
  }, []);

  const handleNavigate = (point) => {
    if (!busLocation) {
      showNotification("Chưa có vị trí xe buýt, không thể dẫn đường!", "warning");
      return;
    }
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
    }
    setRouteCoordinates([]); 
    setRouteStartPoint(busLocation); 
    setRouteDestination(point.position);
  };

  useEffect(() => {
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
    }

    if (routeCoordinates.length > 0 && simulationIndex < routeCoordinates.length - 1) {
      
      simulationInterval.current = setInterval(() => {
        setSimulationIndex(prevIndex => {
          const nextIndex = prevIndex + 1;

          if (nextIndex >= routeCoordinates.length) {
            clearInterval(simulationInterval.current);
            return prevIndex;
          }

          const prevLocation = routeCoordinates[prevIndex];
          const nextLocation = routeCoordinates[nextIndex];
          setBusLocation(nextLocation);

          // --- TÍNH TOÁN DỮ LIỆU ĐỂ GỬI SOCKET ---
          // 1. Tốc độ giả lập (30 - 50 km/h)
          const mockSpeed = Math.floor(Math.random() * (50 - 30 + 1) + 30);
          
          // 2. Tính hướng di chuyển (Bearing)
          // Hàm getBearing đã được khai báo ở đầu file nên không bị lỗi nữa
          const mockHeading = getBearing(prevLocation.lat, prevLocation.lng, nextLocation.lat, nextLocation.lng);

          if (socket && schedule && schedule.bus) {
            console.log("🚀 Đang gửi Socket:", {
    license: schedule.bus.licensePlate,
    route: schedule.route?.name,
    speed: mockSpeed
  });
            // Gửi đầy đủ thông tin cho Admin Map
            socket.emit('driver_update_location', {
              scheduleId: schedule._id,
              busId: schedule.bus._id || schedule.bus,
              
              // Thông tin bổ sung cho Admin
              licensePlate: schedule.bus.licensePlate || "Xe buýt",
              routeName: schedule.route?.name || "Chưa có tuyến",
              status: 'active',
              
              location: nextLocation,
              speed: mockSpeed, 
              heading: mockHeading
            });
          }
          return nextIndex;
        });
      }, 1000); // 1 giây cập nhật 1 lần
    }
    return () => {
      if (simulationInterval.current) { 
        clearInterval(simulationInterval.current);
      }
    };
  }, [routeCoordinates, simulationIndex, socket, schedule]);

  // --- Các hàm xử lý khác (Giữ nguyên) ---
  const handleStudentClick = (student) => setSelectedStudent(student);
  const showNotification = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
  const handleCloseNotification = () => setSnackbar({ ...snackbar, open: false });

  const handleStudentStatusChange = async (stopIndex, studentId, newStatus) => {
    if(!schedule) return;
    try{
      await stopAssignmentAPI.updateStudentStatus(schedule._id, stopIndex, studentId, {status: newStatus});
      setPoints((prevPoints) =>
        prevPoints.map((point) => {
          const updatedStudents = point.students.map((s) => {
            if (s.id === studentId && point.stopIndex === stopIndex) return { ...s, status: newStatus };
            // Logic revert status cho dropoff nếu cần
            if (newStatus === 'absent' && s.id === studentId && s.type === 'dropoff') return { ...s, status: 'absent' };
            if (newStatus === 'boarded' && s.id === studentId && s.type === 'dropoff') return { ...s, status: 'waiting' };
            return s;
          });
          return {
            ...point,
            students: updatedStudents,
            status: checkPointCompletion(updatedStudents) ? 'completed' : 'pending',
          };
        })
      );
      showNotification("Cập nhật trạng thái thành công!", "success");
    } catch(err){
      console.error("Update status error:", err);
      showNotification("Cập nhật trạng thái thất bại!", "error");
    }
  };

  const handlePickupAll = async (stopIndex) => {
    if(!schedule) return;
    const point = points.find(p => p.stopIndex === stopIndex);
    if(!point) return;
    const studentsToUpdate = point.students.filter(s => s.status === 'waiting' && s.type === 'pickup');
    if (studentsToUpdate.length === 0) {
      showNotification("Không có học sinh nào đang chờ đón.", "info");
      return;
    }
    try{
      const updatePromises = studentsToUpdate.map(student => 
        stopAssignmentAPI.updateStudentStatus(schedule._id, stopIndex, student.id, {status: 'boarded'})
      );
      await Promise.all(updatePromises);
      setPoints(prevPoints => 
        prevPoints.map(p => {
          if (p.stopIndex !== stopIndex) return p;
          const updatedStudents = p.students.map(s => (s.status === 'waiting' && s.type === 'pickup') ? { ...s, status: 'boarded' } : s);
          return { ...p, students: updatedStudents, status: checkPointCompletion(updatedStudents) ? 'completed' : 'pending' };
        })
      );
      showNotification(`Đã đón tất cả ${studentsToUpdate.length} học sinh!`, 'success');
    } catch (err) {
      console.error("Pickup all error:", err);
      showNotification("Đón tất cả thất bại!", "error");
    }
  };

  const handleDropoffAll = async (stopIndex) => {
    if (!schedule) return;
    const point = points.find((p) => p.stopIndex === stopIndex);
    if (!point) return;
    const studentsToUpdate = point.students.filter((s) => s.status === 'waiting' && s.type === 'dropoff');
    if (studentsToUpdate.length === 0) {
      showNotification('Không có học sinh nào đang chờ trả.', 'info');
      return;
    }
    try {
      const updatePromises = studentsToUpdate.map((student) =>
        stopAssignmentAPI.updateStudentStatus(schedule._id, stopIndex, student.id, { status: 'dropped_off' })
      );
      await Promise.all(updatePromises);
      setPoints((prevPoints) =>
        prevPoints.map((p) => {
          if (p.stopIndex !== stopIndex) return p;
          const updatedStudents = p.students.map((s) => s.status === 'waiting' && s.type === 'dropoff' ? { ...s, status: 'dropped_off' } : s);
          return { ...p, students: updatedStudents, status: checkPointCompletion(updatedStudents) ? 'completed' : 'pending' };
        })
      );
      showNotification(`Đã trả tất cả ${studentsToUpdate.length} học sinh!`,'success');
    } catch (err) {
      console.error('Dropoff all error:', err);
      showNotification('Trả tất cả thất bại!', 'error');
    }
  };

  const checkScheduleCompletion = (currentPoints) => {
    if (!currentPoints || currentPoints.length === 0) return false;
    for (const point of currentPoints) {
      for (const student of point.students) {
        if (student.status === 'waiting' || student.status === 'pending') return false; 
      }
    }
    return true; 
  };

  const confirmFinishTrip = async () => {
    try {
        setIsLoading(true);
        await scheduleAPI.update(schedule._id, { status: 'completed' });
        showNotification("Chúc mừng! Bạn đã hoàn thành chuyến đi.", "success");
        setShowFinishDialog(false);
        navigate('/driver/trip-history');
    } catch (err) {
        console.error("Finish trip error:", err);
        showNotification("Lỗi khi kết thúc chuyến đi", "error");
        setIsLoading(false);
        setShowFinishDialog(false);
    }
  };

  useEffect(() => {
    if (points.length > 0 && checkScheduleCompletion(points)) {
      if (!showFinishDialog) setShowFinishDialog(true);
    }
  }, [points]);

  const getInitials = (name) => {
    if (!name) return '?';
    return name.trim().split(' ').map((word) => word[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2, color: '#6b7280' }}>Đang tải dữ liệu lịch trình...</Typography>
      </Box>
    );
  }

  if (!schedule || points.length === 0) {
    return (
       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography variant="h6" sx={{ color: '#6b7280' }}>
          Bạn không có lịch trình nào được gán hoặc lịch trình không có điểm dừng.
        </Typography>
      </Box>
    );
  }

  const isStillPickingUp = points.some((point) => point.students.some(
    (student) => student.type === 'pickup' && student.status === 'waiting'
  ));

  return (
    <Box sx={{ display: 'flex', width: '100%', height: 'calc(100vh - 120px)' }}>
      <GlobalStyles styles={{ 
        '.leaflet-routing-container': { display: 'none !important' } 
      }} /> 
      <MapContainer 
        licensePlate={schedule.bus.licensePlate}
        busLocation={busLocation}
        pickupPoints={points}
        routeStartPoint={routeStartPoint}
        routeDestination={routeDestination} 
        onRouteFound={handleRouteFound}
      />
      <PickupSidebar
        points={points}
        onStudentStatusChange={handleStudentStatusChange}
        onPickupAll={handlePickupAll}
        onDropoffAll={handleDropoffAll}
        isStillPickingUp={isStillPickingUp}
        onNavigate={handleNavigate}
        onStudentClick={handleStudentClick}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog 
        open={showFinishDialog} 
        onClose={() => setShowFinishDialog(false)}
      >
        <DialogTitle>{"🎉 Chuyến đi hoàn tất!"}</DialogTitle>
        <DialogContent>
          <Typography>
            Tất cả học sinh trong danh sách đã được xử lý (Đón/Trả/Vắng). 
            <br/><br/>
            Bạn có muốn <b>kết thúc chuyến đi</b> và đóng lộ trình này không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFinishDialog(false)} color="inherit">Xem lại</Button>
          <Button onClick={confirmFinishTrip} variant="contained" color="primary" autoFocus>Xác nhận kết thúc</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={!!selectedStudent} 
        onClose={() => setSelectedStudent(null)}
        fullWidth 
        maxWidth="xs"
      >
        <DialogTitle sx={{ bgcolor: '#f3f4f6', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#3b82f6', fontSize: '1rem' }}>
            {getInitials(selectedStudent?.name)}
          </Avatar>
          <Typography variant="h6">{selectedStudent?.name}</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <List>
            <ListItem>
              <ListItemIcon><School color="primary" /></ListItemIcon>
              <ListItemText primary="Lớp học" secondary={selectedStudent?.class} />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon><Phone color="success" /></ListItemIcon>
              <ListItemText primary="SĐT Phụ huynh " secondary={selectedStudent?.phone} />
            </ListItem>
            <Divider variant="inset" component="li" />
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedStudent(null)} color="inherit">Đóng</Button>
          {selectedStudent?.phone && (
            <Button variant="contained" color="success" href={`tel:${selectedStudent.phone}`} startIcon={<Phone />}>
              Gọi ngay
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DriverPickupPointPage;