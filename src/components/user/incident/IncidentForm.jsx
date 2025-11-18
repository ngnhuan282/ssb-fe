import React, { useState } from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
  Typography,
  Grid,
} from '@mui/material';
import { Description, LocationOn, Send } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import en from 'date-fns/locale/en-GB'; // English locale
import { notificationAPI } from "../../../services/api";
import { useTranslation } from 'react-i18next';

const IncidentForm = () => {
  const { t } = useTranslation();
  const [incidentType, setIncidentType] = useState('');
  const [dateTime, setDateTime] = useState(new Date());
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleSubmit = async (isEmergency = false) => {
    try {
      const formData = new FormData();
      formData.append("user", "6910388ff1c1fce244797451");
      formData.append("type", isEmergency ? "emergency" : "no_emergency");
      formData.append("message", description);
      formData.append("busId", "6910388ff1c1fce244797465");
      formData.append("scheduleId", "6910388ff1c1fce2447974cc");
      formData.append("read", "false");
      formData.append("location", location);
      formData.append("dateTime", dateTime.toISOString());
      formData.append("emergency_type", incidentType);
      if (image) formData.append("image", image);

      await notificationAPI.createIncident(formData);
      alert(isEmergency ? t('incident.form.btnEmergency') + " sent!" : t('incident.form.btnNormal') + " sent!");
      // Reset form nếu cần
    } catch (error) {
      console.error("Error submitting incident:", error);
      alert("Failed to submit report!");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <Box
      component="form"
      noValidate
      sx={{
        p: { xs: 2, md: 4 },
        borderRadius: 3,
        border: '1px solid #e5e7eb',
        bgcolor: '#ffffff',
        boxShadow: 'none',
        maxWidth: 960,
        mx: 'auto',
      }}
    >
      <FormControl fullWidth sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: '#374151' }}>
          {t('incident.form.typeLabel')}
        </Typography>
        <Select
          value={incidentType}
          onChange={(e) => setIncidentType(e.target.value)}
          displayEmpty
          sx={{ bgcolor: '#f9fafb', borderRadius: 2, '& fieldset': { border: '1px solid #e5e7eb' } }}
        >
          <MenuItem value="" disabled>
            <em>{t('incident.form.typePlaceholder')}</em>
          </MenuItem>
          <MenuItem value="traffic_delay">{t('incident.form.types.traffic_delay')}</MenuItem>
          <MenuItem value="student_misconduct">{t('incident.form.types.student_misconduct')}</MenuItem>
          <MenuItem value="bus_breakdown">{t('incident.form.types.bus_breakdown')}</MenuItem>
          <MenuItem value="minor_accident">{t('incident.form.types.minor_accident')}</MenuItem>
          <MenuItem value="other">{t('incident.form.types.other')}</MenuItem>
        </Select>
      </FormControl>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: '#374151' }}>
            {t('incident.form.dateTimeLabel')}
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={en}>
            <DateTimePicker
              value={dateTime}
              onChange={setDateTime}
              ampm={false}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  sx={{
                    bgcolor: '#f9fafb',
                    borderRadius: 2,
                    '& fieldset': { border: '1px solid #e5e7eb' },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: '#374151' }}>
            {t('incident.form.locationLabel')}
          </Typography>
          <TextField
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t('incident.form.locationLabel')}
            sx={{ bgcolor: '#f9fafb', borderRadius: 2, '& fieldset': { border: '1px solid #e5e7eb' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn sx={{ color: '#9ca3af' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: '#374151' }}>
          {t('incident.form.descriptionLabel')}
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder={t('incident.form.descriptionPlaceholder')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ bgcolor: '#f9fafb', borderRadius: 2, '& fieldset': { border: '1px solid #e5e7eb' } }}
        />
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: '#374151' }}>
          {t('incident.form.uploadLabel')}
        </Typography>
        <input
          id="image-upload"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <Box
          onClick={() => document.getElementById('image-upload').click()}
          sx={{
            border: '2px dashed #e5e7eb',
            borderRadius: 2,
            p: 4,
            bgcolor: '#f9fafb',
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': { borderColor: '#ef4444', bgcolor: '#fef2f2' },
          }}
        >
          {!preview ? (
            <>
              <Description sx={{ fontSize: 40, color: '#ef4444' }} />
              <Typography variant="body1" sx={{ color: '#6b7280', mt: 1 }}>
                <Typography component="span" sx={{ color: '#ef4444', fontWeight: 600 }}>
                  Click to upload
                </Typography>{' '}
                or drag and drop
              </Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                {t('incident.form.uploadHint')}
              </Typography>
            </>
          ) : (
            <Box>
              <img src={preview} alt="preview" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 10 }} />
              <Typography sx={{ mt: 1, color: '#6b7280' }}>
                Click to change image
              </Typography>
            </Box>
          )}
        </Box>
      </FormControl>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => handleSubmit(false)}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            fontWeight: 600,
            px: 4,
          }}
        >
          {t('incident.form.btnNormal')}
        </Button>
        <Button
          variant="contained"
          startIcon={<Send />}
          onClick={() => handleSubmit(true)}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            fontWeight: 600,
            bgcolor: '#ef4444',
            '&:hover': { bgcolor: '#dc2626' },
            px: 4,
          }}
        >
          {t('incident.form.btnEmergency')}
        </Button>
      </Box>
    </Box>
  );
};

export default IncidentForm;