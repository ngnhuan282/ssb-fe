// src/pages/user/DriverStudentListPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Paper, LinearProgress,
  Accordion, AccordionSummary, AccordionDetails, Chip, Divider, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, Avatar, List, ListItem, ListItemIcon, ListItemText, IconButton
} from '@mui/material';
import { ExpandMore, LocationOn, Map, Phone, School, Person, Place, Close } from '@mui/icons-material';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import StudentCard from '../../components/user/student/StudentCard';
import { useAuth } from '../../context/AuthContext';
import { scheduleAPI, studentAPI } from '../../services/api';

const DriverStudentListPage = () => {
  const { user, driverId } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [routeName, setRouteName] = useState("");
  
  // State cho Dialog chi tiết học sinh
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // State cho Dialog bản đồ
  const [mapLocation, setMapLocation] = useState(null); // { lat, lng, name }

  useEffect(() => {
    if (driverId) {
      fetchData();
    }
  }, [driverId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Lấy lịch trình
      const scheduleRes = await scheduleAPI.getByDriver(driverId);
      const schedules = scheduleRes.data?.data || [];

      // --- LOGIC MỚI: LỌC THEO NGÀY HÔM NAY ---
      const today = new Date();
      
      // Hàm so sánh ngày (bỏ qua giờ phút)
      const isSameDay = (d1, d2) => {
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
      };

      // 1. Lọc ra các lịch trình CỦA HÔM NAY
      const todaySchedules = schedules.filter(s => isSameDay(s.date, today));

      // 2. Trong các lịch hôm nay, ưu tiên 'in_progress', sau đó đến 'scheduled'
      const activeSchedule = todaySchedules.find(s => s.status === 'in_progress') || 
                             todaySchedules.find(s => s.status === 'scheduled');

      // Nếu không có lịch hôm nay thì hiển thị thông báo rỗng (activeSchedule là undefined)
      if (!activeSchedule) {
        setScheduleData([]);
        setLoading(false); // Dừng loading
        return;
      }

      setRouteName(activeSchedule.route?.name || "Tuyến đường chưa đặt tên");

      // 2. Lấy toàn bộ học sinh (để có data parent đầy đủ nhờ populate ở backend)
      const allStudentsRes = await studentAPI.getAll();
      const allStudents = allStudentsRes.data?.data || [];
      
      const studentIdsInSchedule = activeSchedule.students.map(s => s._id || s);
      const studentsInTrip = allStudents.filter(s => studentIdsInSchedule.includes(s._id));

      // 3. Ghép nối Điểm dừng <-> Học sinh
      const { route } = activeSchedule;
      if (route && route.stops) {
        const formattedData = route.stops.map((stop, index) => {
          const stopName = stop.name || stop.location;

          const studentsAtStop = studentsInTrip.filter(student => {
            if (stop.type === 'pickup') return student.pickupPoint === stopName;
            if (stop.type === 'dropoff') return student.dropoffPoint === stopName;
            return false;
          });

          return {
            stopName: stopName,
            type: stop.type,
            lat: stop.lat || stop.latitude, // Lấy tọa độ từ Route
            lng: stop.lng || stop.longitude,
            students: studentsAtStop
          };
        });

        setScheduleData(formattedData);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCallParent = (phone) => {
    if (phone) window.location.href = `tel:${phone}`;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <LinearProgress sx={{ mb: 2 }} />
        <Typography>Đang tải danh sách...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', pt: 3, pb: 10 }}>
      <Container maxWidth="md">
        
        {/* Header - Use-case Step 2: Hiển thị tuyến đường */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827' }}>
              {t("studentList.title")}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn fontSize="small"/> {routeName}
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<Map />}
            onClick={() => navigate('/driver/pickup-points')}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Vào Lộ Trình
          </Button>
        </Box>

        {scheduleData.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <Typography color="textSecondary">Không có dữ liệu lịch trình.</Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Use-case Step 3: Hiển thị danh sách điểm đón theo thứ tự */}
            {scheduleData.map((point, index) => (
              <Accordion 
                key={index} 
                defaultExpanded={point.students.length > 0}
                sx={{ 
                  borderRadius: '8px !important', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
                  '&:before': {display: 'none'},
                  borderLeft: point.type === 'pickup' ? '4px solid #4caf50' : '4px solid #ff9800'
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', pr: 1 }}>
                    {/* Use-case Step 8: Hiển thị bản đồ (Nút mở map) */}
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setMapLocation({ lat: point.lat, lng: point.lng, name: point.stopName });
                      }}
                      sx={{ bgcolor: '#eff6ff', color: '#3b82f6', '&:hover': { bgcolor: '#dbeafe' } }}
                    >
                      <Place fontSize="small" />
                    </IconButton>

                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 600 }}>
                        {point.stopName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {point.type === 'pickup' ? 'Điểm Đón' : 'Điểm Trả'}
                      </Typography>
                    </Box>

                    <Chip 
                      label={`${point.students.length} HS`} 
                      size="small" 
                      color={point.students.length > 0 ? "primary" : "default"} 
                    />
                  </Box>
                </AccordionSummary>
                <Divider />
                <AccordionDetails sx={{ bgcolor: '#fafafa', p: 1 }}>
                  {/* Use-case Step 4: Với mỗi điểm đón, hiển thị danh sách học sinh */}
                  {point.students.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {point.students.map(student => (
                        <Box key={student._id} onClick={() => setSelectedStudent(student)} sx={{ cursor: 'pointer' }}>
                          <StudentCard 
                            student={student}
                            // Step 6: Thông tin phụ huynh (Nút gọi nhanh ở card)
                            onCallParent={(e) => {
                                // e.stopPropagation(); // Nếu muốn click card mở detail nhưng click nút gọi thì chỉ gọi
                                handleCallParent(student.parent?.user?.phone);
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: '#9ca3af', fontStyle: 'italic', textAlign: 'center', py: 1 }}>
                      Không có học sinh tại điểm này
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}

        {/* --- DIALOG CHI TIẾT HỌC SINH (Step 7) --- */}
        <Dialog 
          open={!!selectedStudent} 
          onClose={() => setSelectedStudent(null)}
          fullWidth 
          maxWidth="xs"
        >
          <DialogTitle sx={{ bgcolor: '#f9fafb', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#3b82f6' }}>{getInitials(selectedStudent?.fullName)}</Avatar>
            <Box>
                <Typography variant="subtitle1" fontWeight="bold">{selectedStudent?.fullName}</Typography>
                <Typography variant="caption" color="textSecondary">ID: {selectedStudent?._id?.slice(-6)}</Typography>
            </Box>
            <IconButton onClick={() => setSelectedStudent(null)} sx={{ ml: 'auto' }} size="small"><Close /></IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <List dense>
              <ListItem>
                <ListItemIcon><School color="primary" /></ListItemIcon>
                <ListItemText primary="Lớp học" secondary={selectedStudent?.class || "Chưa cập nhật"} />
              </ListItem>
              <Divider variant="inset" component="li" />
              
              {/* Thông tin phụ huynh (Step 6) */}
              <ListItem>
                <ListItemIcon><Person color="action" /></ListItemIcon>
                <ListItemText 
                  primary="Phụ huynh" 
                  // Dựa vào parentService.js và studentService.js populate
                  secondary={selectedStudent?.parent?.user?.fullName || selectedStudent?.parent?.user?.username || "Chưa cập nhật"} 
                />
              </ListItem>
              <Divider variant="inset" component="li" />

              <ListItem>
                <ListItemIcon><Phone color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Số điện thoại" 
                  secondary={selectedStudent?.parent?.user?.phone || "Chưa cập nhật"} 
                />
              </ListItem>
              <Divider variant="inset" component="li" />

              <ListItem>
                <ListItemIcon><Place color="error" /></ListItemIcon>
                <ListItemText 
                  primary="Điểm đón / Trả" 
                  secondary={`${selectedStudent?.pickupPoint} ➝ ${selectedStudent?.dropoffPoint}`} 
                />
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            {selectedStudent?.parent?.user?.phone && (
              <Button 
                variant="contained" 
                color="success" 
                fullWidth
                startIcon={<Phone />}
                href={`tel:${selectedStudent.parent.user.phone}`}
              >
                Gọi Phụ Huynh
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* --- DIALOG BẢN ĐỒ (Step 8) --- */}
        <Dialog 
          open={!!mapLocation} 
          onClose={() => setMapLocation(null)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{mapLocation?.name}</Typography>
            <IconButton onClick={() => setMapLocation(null)}><Close /></IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 0, height: 300 }}>
             {mapLocation && (mapLocation.lat && mapLocation.lng ? (
                 <iframe
                    title="Stop Location"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${mapLocation.lat},${mapLocation.lng}&z=15&output=embed`}
                    allowFullScreen
                 />
             ) : (
                 <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                     <Map sx={{ fontSize: 60, color: '#e0e0e0' }} />
                     <Typography color="textSecondary">Chưa có tọa độ cho điểm dừng này</Typography>
                 </Box>
             ))}
          </DialogContent>
          <DialogActions>
            <Button 
                component="a" 
                href={mapLocation ? `https://www.google.com/maps/dir/?api=1&destination=${mapLocation.lat},${mapLocation.lng}` : '#'}
                target="_blank"
                color="primary"
            >
                Mở trong Google Maps
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </Box>
  );
};

export default DriverStudentListPage;