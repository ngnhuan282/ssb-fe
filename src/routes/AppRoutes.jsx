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
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { 
        index: true, 
        element: (
          <ProtectedRoute allowedRoles={['parent', 'driver']}>
            <UserDashboardPage />
          </ProtectedRoute>
        ),
      },
      { 
        path: "bus", 
        element: (
          <ProtectedRoute allowedRoles={['parent']}>
            <BusPage />
          </ProtectedRoute>
        ),
      },
      { 
        path: "schedule", 
        element: (
          <ProtectedRoute allowedRoles={['driver']}>
            <DriverSchedulePage />
          </ProtectedRoute>
        ),
      },
      { 
        path: "pickup-points", 
        element: (
          <ProtectedRoute allowedRoles={['driver']}>
           <DriverPickupPointsPage />
          </ProtectedRoute>
        ),
      },
      { 
        path: "incident", 
        element: (
          <ProtectedRoute allowedRoles={['driver']}>
           <DriverIncidentReportPage />
          </ProtectedRoute>
        ),
      },
      { 
        path: "trip-report", 
        element: (
          <ProtectedRoute allowedRoles={['driver']}>
           <DriverTripReportPage />
          </ProtectedRoute>
        ),
      },
      { 
        path: "students", 
        element: (
          <ProtectedRoute allowedRoles={['driver']}>
            <DriverStudentListPage />
          </ProtectedRoute>
        ),
      },
      { 
        path: "profile", 
        element: (
          <ProtectedRoute allowedRoles={['parent', 'driver']}>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      { path: "parent", element: <ParentPage /> },
    ],
  },
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
  ...adminRoutes,
]);