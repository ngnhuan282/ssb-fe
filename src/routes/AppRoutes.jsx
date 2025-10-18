import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";


// USER pages
import UserDashboardPage from "../pages/user/UserDashboardPage";
import MapPage from "../pages/user/MapPage";
import BusPage from "../pages/user/BusPage";
import DriverPage from "../pages/user/DriverPage";
import LoginPage from "../pages/user/LoginPage";
import RegisterPage from "../pages/user/RegisterPage";
import ErrorPage from "../pages/user/ErrorPage";
import ParentPage from "../pages/user/ParentPage";


// ADMIN pages
import AdminDashboard from "../pages/admin/AdminDashboard";


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
        path: "map", 
        element: (
          <ProtectedRoute allowedRoles={['parent', 'driver']}>
            <MapPage />
          </ProtectedRoute>
        ),
      },
      { 
        path: "bus", 
        element: (
          <ProtectedRoute allowedRoles={['parent', 'driver']}>
            <BusPage />
          </ProtectedRoute>
        ),
      },
      { 
        path: "driver", 
        element: (
          <ProtectedRoute allowedRoles={['parent', 'driver']}>
            <DriverPage />
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
  { path: "/admin", element: <AdminDashboard /> },
]);
