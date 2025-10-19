import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import SchedulePage from "../pages/admin/SchedulePage";
import StudentPage from "../pages/admin/StudentPage";
import DriverPage from "../pages/admin/DriverPage";
import BusesPage from "../pages/admin/BusPage";
import RoutePage from "../pages/admin/RoutePage";
import NotificationPage from "../pages/admin/NotificationPage";

export const adminRoutes = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/schedule",
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <SchedulePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/students",
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <StudentPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/drivers",
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <DriverPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/buses",
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <BusesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/routes",
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <RoutePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/notifications",
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <NotificationPage />
      </ProtectedRoute>
    ),
  },
];