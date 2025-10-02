import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Badge,
} from "@mui/material";
import { Notifications as BellIcon } from "@mui/icons-material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

const Header = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderBottom: "1px solid #ddd",
      }}
    >
      <Toolbar
        sx={{ justifyContent: "space-between", minHeight: "60px !important" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <DirectionsBusIcon
            sx={{
              fontSize: 30,
              color: "#007bff",
            }}
          />
          <Box>
            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontWeight: 700,
                color: "#007bff",
                lineHeight: 1.2,
              }}
            >
              SSB 1.0
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#6c757d",
                fontSize: "14px",
              }}
            >
              Smart School Bus
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton sx={{ color: "#333" }} aria-label="notifications">
            <Badge badgeContent={3} color="error">
              <BellIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
