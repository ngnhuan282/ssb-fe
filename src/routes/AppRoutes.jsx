import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { adminRoutes } from "./AdminRoutes";

// USER pages
import UserDashboardPage from "../pages/user/UserDashboardPage";
import MapPage from "../pages/user/MapPage";
import BusPage from "../pages/user/BusPage";
import DriverPage from "../pages/user/DriverPage";
import DriverStudentListPage from "../pages/user/DriverStudentListPage";
import LoginPage from "../pages/user/LoginPage";
import RegisterPage from "../pages/user/RegisterPage";
import ProfilePage from "../pages/user/ProfilePage";
import ErrorPage from "../pages/user/ErrorPage";
import DriverSchedulePage from "../pages/user/DriverSchedulePage";
import ParentPage from "../pages/user/ParentPage";
import DriverIncidentReportPage from "../pages/user/DriverIncidentReportPage";
import DriverPickupPointsPage from "../pages/user/DriverPickupPointPage";
import DriverTripReportPage from "../pages/user/DriverTripReportPage";
import IncidentDetailPage from "../pages/user/IncidentDetailPage";
import TripHistoryPage from "../pages/user/TripHistoryPage";
import TripDetailPage from "../pages/user/TripDetailPage";
import NotificationPage from "../pages/user/NotificationPage";

export const router = createBrowserRouter([
  // 1. Route cơ bản (Root redirect)
  {
    path: "/",
    element: <PublicRoute><LoginPage /></PublicRoute>, // Mặc định vào Login nếu chưa có gì
    errorElement: <ErrorPage />,
  },

  // 2. DRIVER ROUTES (/driver/...)
  {
    path: "/driver",
    element: (
      <ProtectedRoute allowedRoles={["driver"]}>
        <App />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <UserDashboardPage /> }, // localhost:5173/driver/
      { path: "schedule", element: <DriverSchedulePage /> },
      { path: "pickup-points", element: <DriverPickupPointsPage /> },
      { path: "incident", element: <DriverIncidentReportPage /> },
      { path: "incident-detail/:id", element: <IncidentDetailPage /> },
      { path: "trip-history", element: <TripHistoryPage /> },
      { path: "trip-history/:id", element: <TripDetailPage /> },
      { path: "students", element: <DriverStudentListPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "notification", element: <NotificationPage /> },
      // Mình thấy có path "parent" ở code cũ, nếu nó dành cho driver xem thông tin phụ huynh:
      { path: "parent-info", element: <ParentPage /> },
    ],
  },

  // 3. PARENT ROUTES (/parent/...)
  {
    path: "/parent",
    element: (
      <ProtectedRoute allowedRoles={["parent"]}>
        <App />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <UserDashboardPage /> }, // localhost:5173/parent/
      { path: "bus", element: <MapPage /> }, // Xem bản đồ xe
      { path: "notification", element: <NotificationPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },

  // 4. AUTH ROUTES
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },

  // 5. ADMIN ROUTES
  ...adminRoutes,
]);
