// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

// // Import User pages
// import UserPage from "./page/userpage.jsx";

// // Import Admin pages
// import AdminDashboard from "./page/admin/AdminDashboard.jsx";
// // import ScheduleManagement from "./page/admin/ScheduleManagement.jsx";
// // import MessageCenter from "./page/admin/MessageCenter.jsx";
// // ... import các trang admin khác

// const theme = createTheme({
//   palette: {
//     primary: { main: "#007bff" },
//     error: { main: "#dc3545" },
//     warning: { main: "#ffc107" },
//     success: { main: "#28a745" },
//   },
//   typography: {
//     fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
//   },
// });

// function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <BrowserRouter>
//         <Routes>
//           <Route path="/user" element={<UserPage />} />
//           <Route path="/admin" element={<AdminDashboard />} />
//           <Route path="/admin/dashboard" element={<AdminDashboard />} />

//           <Route path="/" element={<Navigate to="/user" replace />} />
//         </Routes>
//       </BrowserRouter>
//     </ThemeProvider>
//   );
// }

// export default App;
import React from "react";
import MapPage from "./pages/MapPage";

function App() {
  return <MapPage />;
}

export default App;
