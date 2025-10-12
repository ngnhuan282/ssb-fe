// src/pages/user/RegisterPage.jsx
import React, { useState } from "react";
import { Box, Button, Typography, Paper, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

import RegisterHeader from "../../components/user/register/RegisterHeader";
import RegisterStepper from "../../components/user/register/RegisterStepper";
import ParentInfoForm from "../../components/user/register/ParentInfoForm";
import StudentInfoForm from "../../components/user/register/StudentInfoForm";
import PasswordForm from "../../components/user/register/PasswordForm";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    parentName: "",
    email: "",
    phone: "",
    address: "",
    studentName: "",
    studentGrade: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    // Validate current step
    if (activeStep === 0) {
      if (!formData.parentName || !formData.email || !formData.phone || !formData.address) {
        alert("Vui lòng điền đầy đủ thông tin phụ huynh!");
        return;
      }
    } else if (activeStep === 1) {
      if (!formData.studentName || !formData.studentGrade) {
        alert("Vui lòng điền đầy đủ thông tin học sinh!");
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (formData.password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    
    console.log("Register parent with:", formData);
    alert("Đăng ký thành công! Vui lòng liên hệ nhà trường để được gán học sinh vào tuyến xe.");
    navigate("/login");
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <ParentInfoForm formData={formData} onChange={handleChange} />;
      case 1:
        return <StudentInfoForm formData={formData} onChange={handleChange} />;
      case 2:
        return (
          <PasswordForm 
            formData={formData} 
            onChange={handleChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #fce4ec 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        px: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: { xs: 3, sm: 4 },
          width: "100%",
          maxWidth: 500,
          borderRadius: 4,
          backgroundColor: "#fff",
        }}
      >
        <RegisterHeader />
        <RegisterStepper activeStep={activeStep} />

        {/* Alert */}
        {activeStep === 0 && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2, fontSize: 12 }}>
            Sau khi đăng ký, liên hệ nhà trường để gán học sinh vào tuyến xe.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ minHeight: 200 }}>
            {getStepContent(activeStep)}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            {activeStep > 0 && (
              <Button
                onClick={handleBack}
                variant="outlined"
                startIcon={<ArrowBack />}
                sx={{
                  flex: 1,
                  py: 1.2,
                  borderRadius: 2,
                  textTransform: "none",
                  borderColor: "#64b5f6",
                  color: "#64b5f6",
                  "&:hover": {
                    borderColor: "#42a5f5",
                    backgroundColor: "rgba(100, 181, 246, 0.05)",
                  },
                }}
              >
                Quay lại
              </Button>
            )}

            {activeStep < 2 ? (
              <Button
                onClick={handleNext}
                variant="contained"
                endIcon={<ArrowForward />}
                sx={{
                  flex: 1,
                  py: 1.2,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #64b5f6 0%, #ab47bc 100%)",
                  textTransform: "none",
                  "&:hover": {
                    background: "linear-gradient(135deg, #42a5f5 0%, #9c27b0 100%)",
                  },
                }}
              >
                Tiếp theo
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                sx={{
                  flex: 1,
                  py: 1.2,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #64b5f6 0%, #ab47bc 100%)",
                  textTransform: "none",
                  "&:hover": {
                    background: "linear-gradient(135deg, #42a5f5 0%, #9c27b0 100%)",
                  },
                }}
              >
                Đăng ký tài khoản
              </Button>
            )}
          </Box>
        </Box>

        {/* Login link */}
        <Typography sx={{ mt: 3, textAlign: "center", fontSize: 13, color: "#666" }}>
          Đã có tài khoản?{" "}
          <Typography
            component="span"
            onClick={() => navigate("/login")}
            sx={{
              background: "linear-gradient(135deg, #64b5f6 0%, #ab47bc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: "bold",
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Đăng nhập ngay
          </Typography>
        </Typography>
      </Paper>
    </Box>
  );
};

export default RegisterPage;