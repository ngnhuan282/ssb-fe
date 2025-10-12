import React from "react";
import { Typography, Grid, TextField, InputAdornment } from "@mui/material";
import { ChildCare } from "@mui/icons-material";

const StudentInfoForm = ({ formData, onChange }) => {
  return (
    <>
      <Typography 
        variant="subtitle1"
        sx={{ 
          mb: 1.5,
          color: "#ab47bc",
          fontWeight: 600,
          fontSize: 15,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <ChildCare sx={{ fontSize: 20 }} /> Thông tin học sinh
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        {/* Tên học sinh */}
        <Grid item xs={12} sm={7}>
          <TextField
            fullWidth
            label="Họ và tên học sinh"
            name="studentName"
            variant="outlined"
            value={formData.studentName}
            onChange={onChange}
            required
            placeholder="VD: Nguyễn Văn B"
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
                  <ChildCare sx={{ color: "#ab47bc", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Lớp */}
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            label="Lớp"
            name="studentGrade"
            variant="outlined"
            value={formData.studentGrade}
            onChange={onChange}
            required
            placeholder="VD: 5A, 4B"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#f8f9fa",
                "&:hover": { backgroundColor: "#f0f2f5" },
                "&.Mui-focused": { backgroundColor: "#fff" },
              },
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default StudentInfoForm;