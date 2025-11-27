import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  TextField,
  MenuItem,
  Stack
} from '@mui/material';
import { driverAPI, parentAPI, notificationAPI } from '../../../services/api';

const AdminMessageForm = () => {
  const [users, setUsers] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('general');

  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [tempSelected, setTempSelected] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const resDrivers = await driverAPI.getAll();
        const drivers = resDrivers.data.data.map(d => ({
          _id: d.user._id,
          name: d.user.username || '',
          role: d.user.role,
        }));
        const resParents = await parentAPI.getAll();
        const parents = resParents.data.data.map(p => ({
          _id: p.user._id,
          name: p.user.username || p.user.email,
          role: p.user.role,
        }));
        setUsers([...drivers, ...parents].filter(u => u.role !== 'admin'));
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const handleSend = async () => {
    if (!userIds.length) return alert("Vui lòng chọn người nhận!");
    if (!message.trim()) return alert("Vui lòng nhập nội dung!");
    try {
      const payload = { userIds, type, message };
      if (userIds.length === 1) {
        await notificationAPI.createNotificationForOneUser(payload);
      } else {
        await notificationAPI.createNotificationsForUsers(payload);
      }
      alert("Gửi thông báo thành công!");
      setMessage("");
      setUserIds([]);
      setType('general');
    } catch (err) {
      console.error(err);
      alert("Gửi thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const handleOpenDialog = () => {
    setTempSelected(userIds);
    setOpenUserDialog(true);
  };

  const handleConfirmDialog = () => {
    setUserIds(tempSelected);
    setOpenUserDialog(false);
  };

  const handleToggle = (id) => {
    setTempSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleDeleteUser = (id) => {
    setUserIds(prev => prev.filter(uid => uid !== id));
  };

  return (
    <Box sx={{ p: 3, borderRadius: 2, border: '1px solid #e5e7eb', bgcolor: '#fff', mx: 'auto' }}>
 
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
          {userIds.map(id => {
            const user = users.find(u => u._id === id);
            return <Chip key={id} label={user?.name || id} size="small" onDelete={() => handleDeleteUser(id)} />;
          })}
        </Stack>
        <Button variant="outlined" onClick={handleOpenDialog} fullWidth>
          Chọn người nhận
        </Button>
      </Box>

      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Chọn người nhận</DialogTitle>
        <DialogContent dividers sx={{ maxHeight: 300, p: 0 }}>
          <List dense>
            {users.map(u => (
              <ListItem key={u._id} button onClick={() => handleToggle(u._id)}>
                <Checkbox checked={tempSelected.includes(u._id)} />
                <ListItemText primary={`${u.name} (${u.role})`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleConfirmDialog}>OK</Button>
        </DialogActions>
      </Dialog>

      <TextField
        label="Loại thông báo"
        select
        value={type}
        onChange={(e) => setType(e.target.value)}
        sx={{ mb: 2 }}
        fullWidth
      >
        <MenuItem value="message">Tin nhắn</MenuItem>
        <MenuItem value="emergency">Khẩn cấp</MenuItem>
        <MenuItem value="no_emergency">Không khẩn cấp</MenuItem>
        <MenuItem value="arrival">Xe đang đến</MenuItem>
        <MenuItem value="delay">Xe trễ</MenuItem>
        <MenuItem value="resolved_emergency">Giải quyết sự cố</MenuItem>
      </TextField>

      <TextField
        label="Nội dung"
        fullWidth
        multiline
        rows={7}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" color="error" fullWidth onClick={handleSend}>
        Gửi
      </Button>
    </Box>
  );
};

export default AdminMessageForm;
