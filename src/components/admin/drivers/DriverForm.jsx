// src/components/admin/drivers/DriverForm.jsx
// import React from "react";
// import { Box, TextField, MenuItem, Grid } from "@mui/material";

// export default function DriverForm({ formData, errors, handleChange }) {
//   return (
//     <Box sx={{ p: 3 }}>
//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             label="Họ và tên"
//             name="fullName"
//             value={formData.fullName}
//             onChange={handleChange}
//             error={!!errors.fullName}
//             helperText={errors.fullName}
//           />
//         </Grid>

//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             label="Số điện thoại"
//             name="phoneNumber"
//             value={formData.phoneNumber}
//             onChange={handleChange}
//             error={!!errors.phoneNumber}
//             helperText={errors.phoneNumber}
//           />
//         </Grid>

//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             label="Số bằng lái"
//             name="licenseNumber"
//             value={formData.licenseNumber}
//             onChange={handleChange}
//             error={!!errors.licenseNumber}
//             helperText={errors.licenseNumber}
//           />
//         </Grid>

//         <Grid item xs={12}>
//           <TextField
//             select
//             fullWidth
//             label="Trạng thái"
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//           >
//             <MenuItem value="active">Đang làm việc</MenuItem>
//             <MenuItem value="inactive">Nghỉ</MenuItem>
//           </TextField>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }
