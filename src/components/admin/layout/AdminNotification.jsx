import React from "react";
import { Snackbar, Alert, Slide } from "@mui/material";

function SlideTransition(props) {
    return <Slide {...props} direction="left" />;
}

export default function Notification({ open, message, type = "info", onClose, duration = 3000 }) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={onClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            TransitionComponent={SlideTransition}
        >
            <Alert
                onClose={onClose}
                severity={type}
                variant="filled"
                sx={{
                    borderRadius: 3,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                    fontSize: "1rem",
                    fontWeight: 600,
                    px: 3,
                    py: 2,
                    minWidth: 320,
                    maxWidth: 400,
                    letterSpacing: "0.3px",
                    display: "flex",
                    alignItems: "center",
                    animation: "fadeSlide 0.4s ease-out",
                    "@keyframes fadeSlide": {
                        from: { opacity: 0, transform: "translateX(40px)" },
                        to: { opacity: 1, transform: "translateX(0)" },
                    },
                    "& .MuiAlert-icon": {
                        fontSize: "2rem",
                        mr: 2,
                    },
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
