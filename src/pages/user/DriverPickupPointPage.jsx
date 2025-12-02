// src/pages/driver/DriverPickupPointPage.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, CircularProgress, Typography, Snackbar, GlobalStyles, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  List, ListItem, ListItemIcon, ListItemText, Divider, Avatar  
} from '@mui/material';
import { School, Phone } from '@mui/icons-material';
import MapContainer from '../../components/user/pickup/MapContainer';
import PickupSidebar from '../../components/user/pickup/PickupSidebar';
import { useAuth } from '../../context/AuthContext';
import { scheduleAPI, stopAssignmentAPI, locationAPI } from '../../services/api';
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// --- HÀM HELPER TÍNH GÓC QUAY (BEARING) ---
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
  const [completedPointDialog, setCompletedPointDialog] = useState(null);

  // Routing & Simulation State
  const [routeStartPoint, setRouteStartPoint] = useState(null); 
  const [routeDestination, setRouteDestination] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [simulationIndex, setSimulationIndex] = useState(0);
  const simulationInterval = useRef(null); 

  // Socket State
  const [socket, setSocket] = useState(null);

  // Dialog State
  const navigate = useNavigate();
  const [showFinishDialog, setShowFinishDialog] = useState(false);

  // 1. Fetch Data
  useEffect(()=>{
    if(!driverId || user?.role !== 'driver'){
      setIsLoading(false);
      return;
    }

    const fetchDriverData = async ()=>{
      setIsLoading(true);
      try{
        const scheduleRes = await scheduleAPI.getByDriver(driverId);
        const activeSchedule = (scheduleRes.data?.data || scheduleRes.data).find((s) => s.status === 'in_progress') || 
                               (scheduleRes.data?.data || scheduleRes.data).find((s) => s.status === 'scheduled');
        
        if (!activeSchedule) throw new Error("Không tìm thấy lịch trình nào được gán.");

        setSchedule(activeSchedule);
        const currentScheduleId = activeSchedule._id;
        const busId = activeSchedule.bus._id || activeSchedule.bus;

        // Lấy vị trí xe từ DB
        try {
          const locationRes = await locationAPI.getLatestByBus(busId);
          if (locationRes.data && locationRes.data.data) {
            const latestLocation = locationRes.data.data;
            setBusLocation({ lat: latestLocation.latitude, lng: latestLocation.longitude });
          }
        } catch (locErr) {
          console.warn("Chưa có vị trí xe trong DB");
        }

        const { route } = activeSchedule;
        if (!route || !route.stops) throw new Error("Tuyến đường không hợp lệ.");

        const studentPromises = route.stops.map((stop, index)=> 
          stopAssignmentAPI.getStudentsByStop(currentScheduleId,index)
        );
        const studentResponses = await Promise.all(studentPromises);
        
        const finalPointsData = route.stops.map((stop, index) =>{
          const assignments = studentResponses[index].data?.data || studentResponses[index].data; 
          const students = assignments.map(assign => {
            let stopAssignmentStatus = assign.status;
            // Logic đồng bộ trạng thái
            if ( assign.type === 'pickup' && stopAssignmentStatus === 'waiting' && assign.student.status === 'picked_up') stopAssignmentStatus = 'boarded'; 
            if ( assign.type === 'dropoff' && stopAssignmentStatus === 'waiting' && assign.student.status === 'dropped_off' ) stopAssignmentStatus = 'dropped_off';
            if ( assign.type === 'pickup' && stopAssignmentStatus === 'boarded' && assign.student.status === 'pending' ) stopAssignmentStatus = 'waiting';
            if ( (assign.type === 'dropoff' && stopAssignmentStatus === 'dropped_off' && assign.student.status === 'picked_up') || assign.student.status === 'pending') stopAssignmentStatus = 'waiting';

            return {
              id: assign.student._id,
              assignmentId: assign._id,
              name: assign.student.fullName, 
              phone: assign.student.parent?.user?.phone || "Chưa cập nhật",
              class: assign.student.class || "Chưa cập nhật",
              status: stopAssignmentStatus,
              type: assign.type,
            };
          });

          return {
            id: `stop_${index}`,
            stopIndex: index,
            name: stop.location,
            position: { lat: stop.latitude, lng: stop.longitude },
            studentCount: students.length,
            status: checkPointCompletion(students) ? 'completed' : 'pending',
            students: students,
          };
        });
        setPoints(finalPointsData);
      }catch(err){
        console.error("Fetch error:", err);
        showNotification(`Lỗi tải dữ liệu: ${err.message}`, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDriverData();
  },[driverId, user]);

  //dialog hoan thanh diem dung 
  const confirmPointCompletion = () => {
    if (!completedPointDialog) return;
    setPoints(prevPoints => 
      prevPoints.map(p => {
        // Tìm đúng điểm đó và đổi status thật sự thành 'completed'
        if (p.id === completedPointDialog.pointId) {
          return { ...p, status: 'completed' }; 
        }
        return p;
      })
    );
    
    setCompletedPointDialog(null); // Đóng Dialog
    showNotification(`Đã hoàn thành điểm dừng: ${completedPointDialog.pointName}`, 'success');
  };
  useEffect(() => {
    const waitingPoint = points.find(p => p.status === 'waiting_confirm');
    if (waitingPoint) {
      setCompletedPointDialog({ 
          pointId: waitingPoint.id, 
          pointName: waitingPoint.name 
      });
    }
  }, [points]);
  // 2. Socket Connection
  useEffect(() => {
    if (!schedule) return;
    const socketConnection = io(SOCKET_URL);
    setSocket(socketConnection);

    socketConnection.on('connect', () => {
      console.log(`Socket Connected: ${socketConnection.id}`);
      socketConnection.emit('joinScheduleRoom', schedule._id);
    });

    return () => { socketConnection.disconnect(); };
  }, [schedule]);

  // 3. Navigation & Simulation Logic
  const handleRouteFound = useCallback((coordinates) => {
    setRouteCoordinates(coordinates);
    setSimulationIndex(0); 
    if (coordinates.length > 0) setBusLocation(coordinates[0]);
  }, []);

  const handleNavigate = (point) => {
    if (!busLocation) {
      showNotification("Chưa có vị trí xe buýt!", "warning");
      return;
    }
    if (simulationInterval.current) clearInterval(simulationInterval.current);
    setRouteCoordinates([]); 
    setRouteStartPoint(busLocation); 
    setRouteDestination(point.position);
  };

  useEffect(() => {
    if (simulationInterval.current) clearInterval(simulationInterval.current);

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
          const mockSpeed = Math.floor(Math.random() * (50 - 30 + 1) + 30);
          const mockHeading = getBearing(prevLocation.lat, prevLocation.lng, nextLocation.lat, nextLocation.lng);

          if (socket && schedule && schedule.bus) {
            // GỬI FULL INFO CHO ADMIN
            socket.emit('driver_update_location', {
              scheduleId: schedule._id,
              busId: schedule.bus._id || schedule.bus,
              
              // Thông tin quan trọng để Admin hiển thị
              licensePlate: schedule.bus.licensePlate || "Xe buýt", // Lấy biển số từ schedule
              routeName: schedule.route?.name || "Chưa cập nhật",   // Lấy tên tuyến
              status: 'active',
              
              location: nextLocation,
              speed: mockSpeed, 
              heading: mockHeading
            });
          }
          return nextIndex;
        });
      }, 1000); 
    }
    return () => { if (simulationInterval.current) clearInterval(simulationInterval.current); };
  }, [routeCoordinates, simulationIndex, socket, schedule]);

  // 4. Other Handlers
  const handleStudentClick = (student) => setSelectedStudent(student);
  const showNotification = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
  const handleCloseNotification = () => setSnackbar({ ...snackbar, open: false });

  const handleStudentStatusChange = async (stopIndex, studentId, newStatus) => {
    if(!schedule) return;
    try{
      await stopAssignmentAPI.updateStudentStatus(schedule._id, stopIndex, studentId, {status: newStatus});
      setPoints((prevPoints) => prevPoints.map((point) => {
          const updatedStudents = point.students.map((s) => {
            if (s.id === studentId && point.stopIndex === stopIndex) return { ...s, status: newStatus };
            if (newStatus === 'absent' && s.id === studentId && s.type === 'dropoff') return { ...s, status: 'absent' };
            if (newStatus === 'boarded' && s.id === studentId && s.type === 'dropoff') return { ...s, status: 'waiting' };
            return s;
          });
      const isDone = checkPointCompletion(updatedStudents);
      let updatedPointStatus = point.status; 
        if (isDone && point.status !== 'completed' && point.status !== 'waiting_confirm') {
            updatedPointStatus = 'waiting_confirm';
        } else if (!isDone && point.status === 'waiting_confirm') {
            updatedPointStatus = 'pending';
        }
        return {
          ...point,
          students: updatedStudents,
          status: updatedPointStatus
        };
      })
    );
    showNotification("Cập nhật trạng thái thành công!", "success");
    }catch(err){
      console.error("Update status error:", err);
      showNotification("Cập nhật trạng thái thất bại!", "error");
    }
  };

  const handlePickupAll = async (stopIndex) => {
    if(!schedule) return;
    const point = points.find(p => p.stopIndex === stopIndex);
    if(!point) return;
    const studentsToUpdate = point.students.filter(s => s.status === 'waiting' && s.type === 'pickup');
    if (studentsToUpdate.length === 0) { showNotification("Không có học sinh nào chờ đón.", "info"); return; }
    try{
      await Promise.all(studentsToUpdate.map(s => stopAssignmentAPI.updateStudentStatus(schedule._id, stopIndex, s.id, {status: 'boarded'})));
      setPoints(prev => prev.map(p => {
        if (p.stopIndex !== stopIndex) return p;
        const updatedStudents = p.students.map(s => (s.status === 'waiting' && s.type === 'pickup') ? { ...s, status: 'boarded' } : s);     
        const isDone = checkPointCompletion(updatedStudents);
        let nextPointStatus = p.status;
        if (isDone && p.status !== 'completed') {
             nextPointStatus = 'waiting_confirm';
        }
        return { ...p, students: updatedStudents, status: nextPointStatus };
      }));
      showNotification(`Đã đón ${studentsToUpdate.length} học sinh!`, 'success');
    } catch (err) { showNotification("Lỗi đón tất cả!", "error"); }
  };

  const handleDropoffAll = async (stopIndex) => {
    if (!schedule) return;
    const point = points.find(p => p.stopIndex === stopIndex);
    if(!point) return;
    const studentsToUpdate = point.students.filter(s => s.status === 'waiting' && s.type === 'dropoff');
    if (studentsToUpdate.length === 0) { showNotification("Không có học sinh nào chờ trả.", "info"); return; }
    try {
      await Promise.all(studentsToUpdate.map(s => stopAssignmentAPI.updateStudentStatus(schedule._id, stopIndex, s.id, { status: 'dropped_off' })));
      setPoints(prev => prev.map(p => {
        if (p.stopIndex !== stopIndex) return p;
        const updatedStudents = p.students.map(s => (s.status === 'waiting' && s.type === 'dropoff') ? { ...s, status: 'dropped_off' } : s);
        const isDone = checkPointCompletion(updatedStudents);
        let nextPointStatus = p.status;
        if (isDone && p.status !== 'completed') {
             nextPointStatus = 'waiting_confirm';
        }
        return { ...p, students: updatedStudents, status: nextPointStatus };
      }));
      showNotification(`Đã trả ${studentsToUpdate.length} học sinh!`, 'success');
    } catch (err) { showNotification("Lỗi trả tất cả!", "error"); }
  };

  const checkScheduleCompletion = (currentPoints) => {
    if (!currentPoints || currentPoints.length === 0) return false;
    for (const p of currentPoints) {
      for (const s of p.students) if (s.status === 'waiting' || s.status === 'pending') return false; 
    }
    return true; 
  };

  const confirmFinishTrip = async () => {
    try {
        setIsLoading(true);
        await scheduleAPI.update(schedule._id, { status: 'completed' });
        showNotification("Hoàn thành chuyến đi!", "success");
        setShowFinishDialog(false);
        navigate('/driver/trip-history');
    } catch (err) { showNotification("Lỗi kết thúc chuyến đi", "error"); setIsLoading(false); setShowFinishDialog(false); }
  };

  useEffect(() => {
    if (points.length > 0 && checkScheduleCompletion(points) && !showFinishDialog) setShowFinishDialog(true);
  }, [points]);

  const getInitials = (name) => name ? name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /><Typography sx={{ ml: 2 }}>Đang tải...</Typography></Box>;
  if (!schedule || points.length === 0) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><Typography>Không có lịch trình.</Typography></Box>;

  const isStillPickingUp = points.some(p => p.students.some(s => s.type === 'pickup' && s.status === 'waiting'));

  return (
    <Box sx={{ display: 'flex', width: '100%', height: 'calc(100vh - 120px)' }}>
      <GlobalStyles styles={{ '.leaflet-routing-container': { display: 'none !important' } }} /> 
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
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseNotification} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseNotification} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>

      {/* Dialogs */}
      <Dialog open={showFinishDialog} onClose={() => setShowFinishDialog(false)}>
        <DialogTitle>🎉 Chuyến đi hoàn tất!</DialogTitle>
        <DialogContent><Typography>Bạn có muốn kết thúc chuyến đi?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFinishDialog(false)}>Xem lại</Button>
          <Button onClick={confirmFinishTrip} variant="contained" autoFocus>Kết thúc</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!selectedStudent} onClose={() => setSelectedStudent(null)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar>{getInitials(selectedStudent?.name)}</Avatar>
          <Typography variant="h6">{selectedStudent?.name}</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <List>
            <ListItem><ListItemIcon><School/></ListItemIcon><ListItemText primary="Lớp" secondary={selectedStudent?.class} /></ListItem>
            <Divider variant="inset" component="li" />
            <ListItem><ListItemIcon><Phone/></ListItemIcon><ListItemText primary="SĐT" secondary={selectedStudent?.phone} /></ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedStudent(null)}>Đóng</Button>
          {selectedStudent?.phone && <Button variant="contained" color="success" href={`tel:${selectedStudent.phone}`} startIcon={<Phone />}>Gọi</Button>}
        </DialogActions>
      </Dialog>

      <Dialog 
        open={!!completedPointDialog} 
        onClose={() => setCompletedPointDialog(null)}
      >
        <DialogTitle sx={{ bgcolor: '#f0fdf4', color: '#166534' }}>
          Xác nhận hoàn thành
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>
            Bạn đã xử lý xong tất cả học sinh tại điểm: 
            <br/>
            <strong>{completedPointDialog?.pointName}</strong>
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Xác nhận hoàn thành để đóng điểm này và tiếp tục di chuyển?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompletedPointDialog(null)} color="inherit">
            Xem lại
          </Button>
          <Button 
            onClick={confirmPointCompletion} 
            variant="contained" 
            color="success"
            autoFocus
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DriverPickupPointPage;