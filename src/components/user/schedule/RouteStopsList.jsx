// src/components/user/driver/RouteStopsList.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Circle,
  People,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const RouteStopsList = ({ route }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';

  if (!route || !route.stops || route.stops.length === 0) {
    return (
      <Card sx={{ boxShadow: 1, borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="textSecondary">
            {t("routeStops.noStops")}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card sx={{ boxShadow: 1, borderRadius: 1, border: '1px solid #e0e0e0' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#212121' }}>
          {t("routeStops.title")}
        </Typography>

        <List sx={{ p: 0 }}>
          {route.stops.map((stop, index) => {
            const stopName = stop.name || stop.location || t("routeStops.types.unknown");
            const stopType = stop.type || 'unknown';

            return (
              <ListItem
                key={index}
                sx={{
                  px: 0,
                  py: 2,
                  borderBottom: index < route.stops.length - 1 ? '1px solid #f5f5f5' : 'none',
                  position: 'relative',
                  '&:before': index < route.stops.length - 1 ? {
                    content: '""',
                    position: 'absolute',
                    left: 11,
                    top: 40,
                    bottom: -16,
                    width: 2,
                    bgcolor: '#e0e0e0',
                  } : {},
                }}
              >
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                  <Circle sx={{ fontSize: 24, color: '#1976d2' }} />
                </Box>

                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          color: '#424242',
                        }}
                      >
                        {stopName}
                      </Typography>
                      
                      {stopType === 'pickup' && (
                        <Chip
                          icon={<ArrowUpward sx={{ fontSize: 12 }} />}
                          label={t("routeStops.types.pickup")}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.65rem',
                            bgcolor: '#e8f5e9',
                            color: '#2e7d32',
                            fontWeight: 500,
                            '& .MuiChip-icon': { color: '#2e7d32' },
                          }}
                        />
                      )}
                      {stopType === 'dropoff' && (
                        <Chip
                          icon={<ArrowDownward sx={{ fontSize: 12 }} />}
                          label={t("routeStops.types.dropoff")}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.65rem',
                            bgcolor: '#fff3e0',
                            color: '#e65100',
                            fontWeight: 500,
                            '& .MuiChip-icon': { color: '#e65100' },
                          }}
                        />
                      )}
                      
                      {(stop.studentCount || 0) > 0 && (
                        <Chip
                          icon={<People sx={{ fontSize: 14 }} />}
                          label={`${stop.studentCount} ${t("routeStops.students")}`}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.65rem',
                            bgcolor: '#e3f2fd',
                            color: '#1565c0',
                            fontWeight: 500,
                            '& .MuiChip-icon': {
                              color: '#1565c0',
                            },
                          }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
                      {formatTime(stop.time) || t("routeStops.noTime")}
                      {stop.lat && stop.lng && (
                        <span style={{ marginLeft: 8, color: '#bdbdbd' }}>
                          • {stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}
                        </span>
                      )}
                    </Typography>
                  }
                />
              </ListItem>
            );
          })}
        </List>

        {/* Distance & Estimated Time */}
        {(route.distance || route.estimatedTime) && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f5f5f5' }}>
            <Typography variant="caption" sx={{ color: '#757575', fontWeight: 600, display: 'block', mb: 1 }}>
              {t("routeStops.infoTitle")}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="textSecondary">
                {t("routeStops.distance")}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 500, color: '#424242' }}>
                {route.distance} {t("routeStops.km")}
              </Typography>
            </Box>
            {route.estimatedTime && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="textSecondary">
                  {t("routeStops.estimatedTime")}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 500, color: '#424242' }}>
                  {route.estimatedTime} {t("routeStops.minutes")}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteStopsList;