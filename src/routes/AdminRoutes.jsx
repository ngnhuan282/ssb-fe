import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../components/admin/layout/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import SchedulePage from "../pages/admin/SchedulePage";
import StudentPage from "../pages/admin/StudentPage";
import DriverPage from "../pages/admin/DriverPage";
import BusPage from "../pages/admin/BusPage";
import RoutePage from "../pages/admin/RoutePage";
import NotificationPage from "../pages/admin/NotificationPage";
import AdminTrackingPage from "../pages/admin/AdminTrackingPage";

export const adminRoutes = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "schedule",
        element: <SchedulePage />,
      },
      {
        path: "students",
        element: <StudentPage />,
      },
      {
        path: "drivers",
        element: <DriverPage />,
      },
      {
        path: "buses",
        element: <BusPage />,
      },
      {
        path: "routes",
        element: <RoutePage />,
      },
      {
        path: "notifications",
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <NotificationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "tracking",
        element: <AdminTrackingPage />,
      },

    ],
  },
];