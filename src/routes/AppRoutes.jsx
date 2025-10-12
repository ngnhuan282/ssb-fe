import { createBrowserRouter } from "react-router-dom";
import App from "../App";

// USER pages
import UserDashboardPage from "../pages/user/UserDashboardPage";
import MapPage from "../pages/user/MapPage";
import BusPage from "../pages/user/BusPage";
import DriverPage from "../pages/user/DriverPage";
import LoginPage from "../pages/user/LoginPage";
import RegisterPage from "../pages/user/RegisterPage";

// ADMIN pages
import AdminDashboard from "../pages/admin/AdminDashboard";

// Trang 404
const NotFound = () => <div style={{ padding: 24 }}>404 - Không tìm thấy trang</div>;

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <UserDashboardPage /> },
      { path: "map", element: <MapPage /> },
      { path: "bus", element: <BusPage /> },
      { path: "driver", element: <DriverPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/admin", element: <AdminDashboard /> },
]);
