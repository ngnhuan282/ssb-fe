// src/components/user/register/ParentInfoForm.jsx
import React from "react";
import { Grid, TextField, InputAdornment } from "@mui/material";
import { Person, Email, Phone, Home } from "@mui/icons-material";

const ParentInfoForm = ({ formData, onChange }) => {
  return (
    <Grid container spacing={2}>
      {/* Họ tên phụ huynh */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Họ và tên phụ huynh"
          name="parentName"
          variant="outlined"
          value={formData.parentName}
          onChange={onChange}
          required
          placeholder="VD: Nguyễn Văn A"
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#f8f9fa",
              "&:hover": { backgroundColor: "#f0f2f5" },
              "&.Mui-focused": { backgroundColor: "#fff" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person sx={{ color: "#64b5f6", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      {/* Email */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          variant="outlined"
          type="email"
          value={formData.email}
          onChange={onChange}
          required
          placeholder="example@email.com"
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#f8f9fa",
              "&:hover": { backgroundColor: "#f0f2f5" },
              "&.Mui-focused": { backgroundColor: "#fff" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: "#64b5f6", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      {/* Số điện thoại */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Số điện thoại"
          name="phone"
          variant="outlined"
          value={formData.phone}
          onChange={onChange}
          required
          placeholder="0909xxxxxx"
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#f8f9fa",
              "&:hover": { backgroundColor: "#f0f2f5" },
              "&.Mui-focused": { backgroundColor: "#fff" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone sx={{ color: "#64b5f6", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      {/* Địa chỉ */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Địa chỉ nhà"
          name="address"
          variant="outlined"
          value={formData.address}
          onChange={onChange}
          required
          placeholder="Số nhà, đường, quận, thành phố"
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#f8f9fa",
              "&:hover": { backgroundColor: "#f0f2f5" },
              "&.Mui-focused": { backgroundColor: "#fff" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Home sx={{ color: "#64b5f6", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Grid>
  );
};

export default ParentInfoForm;