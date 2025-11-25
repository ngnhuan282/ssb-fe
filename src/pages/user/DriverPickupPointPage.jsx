// src/pages/driver/PickupPointPage.jsx
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
  Button  } from '@mui/material';
import MapContainer from '../../components/user/pickup/MapContainer';
import PickupSidebar from '../../components/user/pickup/PickupSidebar';
import { useAuth } from '../../context/AuthContext';
import { scheduleAPI, stopAssignmentAPI,locationAPI } from '../../services/api';
import { Newspaper } from 'lucide-react';
import { io } from "socket.io-client";


  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
  // Kiểm tra xem tất cả học sinh trong 1 điểm đã được xử lý chưa
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

    // State cho routing , running 
    const [routeStartPoint, setRouteStartPoint] = useState(null); 
    const [routeDestination, setRouteDestination] = useState(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [simulationIndex, setSimulationIndex] = useState(0);
    const simulationInterval = useRef(null); 

    //SOCKET (state de giu ket noi socket)
    const [socket, setSocket] = useState(null);

    //dialog hoan thanh 
    const navigate = useNavigate();
    const [showFinishDialog, setShowFinishDialog] = useState(false);

    useEffect(()=>{
      
        console.log("👤 user:", user);
        console.log("🆔 driverId:", driverId);
  
      if(!driverId || user?.role !== 'driver'){
        setIsLoading(false);
        return;
      }

      const fetchDriverData = async ()=>{
        setIsLoading(true);
        try{
          const scheduleRes = await scheduleAPI.getByDriver(driverId);
          const activeSchedule = (scheduleRes.data?.data || scheduleRes.data).find((s) => s.status === 'in_progress');
          console.log("Schedule : " , activeSchedule)
          if (!activeSchedule) {
            throw new Error("Không tìm thấy lịch trình nào được gán.");
          }

          setSchedule(activeSchedule);
          const currentScheduleId = activeSchedule._id;
          const busId = activeSchedule.bus._id || activeSchedule.bus;
          //lay location cua bus
          try {
            const locationRes = await locationAPI.getLatestByBus(busId);
            
            if (locationRes.data && locationRes.data.data) {
              const latestLocation = locationRes.data.data;
              setBusLocation({
                lat: latestLocation.latitude,
                lng: latestLocation.longitude
              });
              console.log("location " ,locationRes.data.data)
            } else {
               console.warn("Không tìm thấy vị trí đã lưu cho xe buýt này.");
            }
          } catch (locErr) {
            console.error("Lỗi khi lấy vị trí từ DB:", locErr.message);
          }

          //lay diem dung
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
              // id: assign.student._id,
              // assignmentId: assign._id,
              // name: assign.student.fullName, 
              // status: assign.status,
              // type: assign.type,

              //dieu kien giup neu admin thay doi status hs thi cap nhap status stop luon
              let stopAssignmentStatus = assign.status;
              if ( assign.type === 'pickup' && stopAssignmentStatus === 'waiting' && assign.student.status === 'picked_up'){
                stopAssignmentStatus = 'boarded'; 
              }
              if ( assign.type === 'dropoff' && stopAssignmentStatus === 'waiting' && assign.student.status === 'dropped_off' ){
                stopAssignmentStatus = 'dropped_off';
              }
              //dieu kien de revert
              if ( assign.type === 'pickup' && stopAssignmentStatus === 'boarded' && assign.student.status === 'pending' ){
                stopAssignmentStatus = 'waiting';
              }
              if ( assign.type === 'dropoff' && stopAssignmentStatus === 'dropped_off' && assign.student.status === 'picked_up' || assign.student.status === 'pending'){
                stopAssignmentStatus = 'waiting';
              }
              //khong can them || assign.student.status === 'pending' o dk 4 cung dc vi co dk 3 no se tim den diem dung truoc va phat hien admin chuyen ve pending
              // // nhung them de chac chan lo nhu diem tra no nam truoc diem dung (nhung ke ca vay cx k sai chi hop logic)

              return {
                id: assign.student._id,
                assignmentId: assign._id,
                name: assign.student.fullName, 
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
          console.log("🔍 finalPointsData:", finalPointsData);
          setPoints(finalPointsData);
        }catch(err){
          console.error("Fetch data error:", err);
          showNotification(`Lỗi tải dữ liệu: ${err.message || 'Server error'}`, 'error');
        } finally {
          setIsLoading(false);
        }
      };
      fetchDriverData();
    },[driverId, user]);

    //SOCKETTTTTTTT
    useEffect(() => {
      if (!schedule) return;
      
      const socketConnection = io(SOCKET_URL);
      setSocket(socketConnection);
      console.log("Socket: Đang kết nối...");

      socketConnection.on('connect', () => {
        console.log(`Socket: Đã kết nối với ID ${socketConnection.id}`);
        socketConnection.emit('joinScheduleRoom', schedule._id);
        console.log(`Socket: Đã gửi yêu cầu tham gia phòng ${schedule._id}`);
      });

      return () => {
        console.log("Socket: Ngắt kết nối.");
        socketConnection.disconnect();
      };
    }, [schedule]);

    const showNotification = (message, severity = 'success') => {
      setSnackbar({ open: true, message, severity });
    };

    const handleCloseNotification = () => {
      setSnackbar({ ...snackbar, open: false });
    };

  const handleStudentStatusChange= async (stopIndex, studentId,newStatus )=> {
    if(!schedule) return;
    try{
      await stopAssignmentAPI.updateStudentStatus(
        schedule._id,
        stopIndex,
        studentId,
        {status: newStatus}
      );
      console.log("thay doi : ",points)
      setPoints((prevPoints) =>
        prevPoints.map((point) => {
      const updatedStudents = point.students.map((s) => {
        if (s.id === studentId && point.stopIndex === stopIndex) {
          console.log("new status : ", newStatus)
          return { ...s, status: newStatus };
        }
        if (newStatus === 'absent' && s.id === studentId && s.type === 'dropoff') {
          console.log("vao case 2")
          return { ...s, status: 'absent' };
        }
        if (newStatus === 'boarded' && s.id === studentId && s.type === 'dropoff') {
          console.log("vao case 3")
          return { ...s, status: 'waiting' };
        }
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
    }catch(err){
      console.error("Update status error:", err);
      showNotification("Cập nhật trạng thái thất bại!", "error");
    }
  };

    const handlePickupAll = async (stopIndex) => {
      if(!schedule) return;

      const point = points.find(p => p.stopIndex === stopIndex);
      if(!point) return;

      const studentsToUpdate = point.students.filter(
        s => s.status === 'waiting' && s.type === 'pickup'
      );

      if (studentsToUpdate.length === 0) {
        showNotification("Không có học sinh nào đang chờ đón.", "info");
        return;
      }

      try{
        const updatePromises = studentsToUpdate.map(student => 
          stopAssignmentAPI.updateStudentStatus(
            schedule._id,
            stopIndex,
            student.id,
            {status: 'boarded'}
          )
        );
        await Promise.all(updatePromises);

        setPoints(prevPoints => 
          prevPoints.map(p => {
            if (p.stopIndex !== stopIndex) return p;

            const updatedStudents = p.students.map(s =>
              (s.status === 'waiting' && s.type === 'pickup') ? { ...s, status: 'boarded' } : s
            );

            return {
              ...p, 
              students: updatedStudents,
              status: checkPointCompletion(updatedStudents) ? 'completed' : 'pending',
            };
          })
        );

        showNotification(`Đã đón tất cả ${studentsToUpdate.length} học sinh!`, 'success');

      }catch (err) {
        console.error("Pickup all error:", err);
        showNotification("Đón tất cả thất bại!", "error");
      }
    };
  
    //TRA TAT CA
  const handleDropoffAll = async (stopIndex) => {
    if (!schedule) return;

    const point = points.find((p) => p.stopIndex === stopIndex);
    if (!point) return;

    const studentsToUpdate = point.students.filter(
      (s) => s.status === 'waiting' && s.type === 'dropoff'
    );

    if (studentsToUpdate.length === 0) {
      showNotification('Không có học sinh nào đang chờ trả.', 'info');
      return;
    }

    try {
      const updatePromises = studentsToUpdate.map((student) =>
        stopAssignmentAPI.updateStudentStatus(
          schedule._id,
          stopIndex,
          student.id,
          { status: 'dropped_off' }
        )
      );
      await Promise.all(updatePromises);

      setPoints((prevPoints) =>
        prevPoints.map((p) => {
          if (p.stopIndex !== stopIndex) return p;

          const updatedStudents = p.students.map((s) =>
            s.status === 'waiting' && s.type === 'dropoff' ? { ...s, status: 'dropped_off' } : s
          );

          return {
            ...p,
            students: updatedStudents,
            status: checkPointCompletion(updatedStudents) ? 'completed' : 'pending',
          };
        })
      );

      showNotification(`Đã trả tất cả ${studentsToUpdate.length} học sinh!`,'success');
    } catch (err) {
      console.error('Dropoff all error:', err);
      showNotification('Trả tất cả thất bại!', 'error');
    }
  };

  // --- LOGIC GIẢ LẬP ---
  const handleRouteFound = useCallback((coordinates) => {
    console.log("Đã tìm thấy tuyến đường với", coordinates.length, "điểm.");
    setRouteCoordinates(coordinates);
    setSimulationIndex(0); // Bắt đầu từ điểm đầu tiên
    
    // Snap xe buýt đến vị trí đầu tiên của tuyến đường
    if (coordinates.length > 0) {
      setBusLocation(coordinates[0]);
    }
  }, []); // useCallback để hàm này không bị tạo lại


  const handleNavigate = (point) => {
    if (!busLocation) {
      showNotification("Chưa có vị trí xe buýt, không thể dẫn đường!", "warning");
      return;
    }
    console.log("Dẫn đường tới:", point.name);

    // Dọn dẹp giả lập cũ (nếu có)
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
    }
    setRouteCoordinates([]); // Xóa tuyến đường cũ
    
    // ĐÂY LÀ MẤU CHỐT:
    // setRouteStartPoint snapshot lại vị trí *hiện tại* của xe buýt
    // và nó sẽ KHÔNG THAY ĐỔI trong suốt quá trình giả lập
    setRouteStartPoint(busLocation); 
    
    // Set điểm đến
    setRouteDestination(point.position);
  };

  useEffect(() => {
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
    }

    if (routeCoordinates.length > 0 && simulationIndex < routeCoordinates.length - 1) {
      
      simulationInterval.current = setInterval(() => {
        // Cập nhật VỊ TRÍ XE BUÝT (busLocation)
        // Dùng `setSimulationIndex` để trigger vòng lặp tiếp theo
        setSimulationIndex(prevIndex => {
          const nextIndex = prevIndex + 1;

          if (nextIndex >= routeCoordinates.length) {
            clearInterval(simulationInterval.current); // Dừng lại khi đến cuối
            return prevIndex;
          }

          // setBusLocation(routeCoordinates[nextIndex]);
          const nextLocation = routeCoordinates[nextIndex];
          setBusLocation(nextLocation);

          if (socket && schedule && schedule.bus) {
            socket.emit('driver_update_location', {
              scheduleId: schedule._id,
              busId: schedule.bus._id || schedule.bus,
              location: nextLocation
            });
          }
          return nextIndex;
        });
      }, 1000);
    }
    return () => {
      if (simulationInterval.current) { 
        clearInterval(simulationInterval.current);
      }
    };
  }, [routeCoordinates, simulationIndex, socket, schedule]);

  //Ket thuc
  const checkScheduleCompletion = (currentPoints) => {
      if (!currentPoints || currentPoints.length === 0) return false;
      
      for (const point of currentPoints) {
        for (const student of point.students) {
          if (student.status === 'waiting' || student.status === 'pending') {
            return false; 
          }
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
        if (!showFinishDialog) {
          setShowFinishDialog(true);
        }
      }
    }, [points]);
    

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
      )
    );
    


  return (
    <Box sx={{ display: 'flex', width: '100%', height: 'calc(100vh - 120px)' }}>
      <GlobalStyles styles={{ //Tat hien thi chi tiet sau khi route o Map
        '.leaflet-routing-container': { 
          display: 'none !important' 
        } 
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
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
      {/* Dùng Alert bên trong Snackbar để có màu sắc (severity) */}
      <Alert
        onClose={handleCloseNotification}
        severity={snackbar.severity}
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>

    <Dialog 
        open={showFinishDialog} 
        onClose={() => setShowFinishDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"🎉 Chuyến đi hoàn tất!"}
        </DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Tất cả học sinh trong danh sách đã được xử lý (Đón/Trả/Vắng). 
            <br/><br/>
            Bạn có muốn <b>kết thúc chuyến đi</b> và đóng lộ trình này không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFinishDialog(false)} color="inherit">
            Xem lại
          </Button>
          <Button onClick={confirmFinishTrip} variant="contained" color="primary" autoFocus>
            Xác nhận kết thúc
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DriverPickupPointPage;