// src/components/user/register/RegisterHeader.jsx
import { Box, Typography } from '@mui/material';
import SchoolBusImage from '../../../assets/school-bus.png';

export default function RegisterHeader() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',    // Căn giữa ngang
        justifyContent: 'center', // Căn giữa dọc
        textAlign: 'center',
        height: '100%',
        px: { xs: 2, md: 3 },
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        color="primary"
        gutterBottom
        sx={{
          fontSize: { xs: '1.8rem', md: '2.2rem' },
          lineHeight: 1.2,
        }}
      >
        SSB 1.0
      </Typography>

      <Typography
        variant="subtitle1"
        color="text.secondary"
        sx={{
          mb: 3,
          fontSize: { xs: '1rem', md: '1.1rem' },
          maxWidth: 280,
        }}
      >
        An tâm trên mọi nẻo đường
      </Typography>

      <Box
        sx={{
          width: '100%',
          maxWidth: 320,
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
        }}
      >
        <img
          src={SchoolBusImage}
          alt="School Bus"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
      </Box>
    </Box>
  );
}