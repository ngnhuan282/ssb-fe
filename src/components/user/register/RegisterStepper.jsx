// src/components/user/register/RegisterStepper.jsx
import React from "react";
import { Box, Stepper, Step, StepLabel } from "@mui/material";
import { Person, ChildCare, Lock } from "@mui/icons-material";

const steps = [
  { label: "Thông tin phụ huynh", icon: <Person /> },
  { label: "Thông tin học sinh", icon: <ChildCare /> },
  { label: "Bảo mật tài khoản", icon: <Lock /> },
];

const RegisterStepper = ({ activeStep }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel
              StepIconComponent={() => (
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      activeStep >= index
                        ? "linear-gradient(135deg, #64b5f6 0%, #ab47bc 100%)"
                        : "#e0e0e0",
                    color: "#fff",
                  }}
                >
                  {step.icon}
                </Box>
              )}
            >
              <Box sx={{ fontSize: { xs: 11, sm: 13 }, mt: 1 }}>
                {step.label}
              </Box>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default RegisterStepper;