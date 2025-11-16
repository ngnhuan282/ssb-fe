// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import { router } from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { Auth0Provider } from "@auth0/auth0-react";
import RedirectHandler from "./components/user/handler/RedirectHandler";
import "./index.css";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: "openid profile email",
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}          
      useRefreshTokensFallback={false}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <RouterProvider router={router} >
            <RedirectHandler />
          </RouterProvider>
        </AuthProvider>
      </ThemeProvider>
    </Auth0Provider>
  </React.StrictMode>
);