import { createBrowserRouter } from "react-router-dom";
import App from "../App";

// USER pages
import UserDashboardPage from "../pages/user/UserDashboardPage";
import MapPage from "../pages/user/MapPage";
import BusPage from "../pages/user/BusPage";
import DriverPage from "../pages/user/DriverPage";
import LoginPage from "../pages/user/LoginPage";
import RegisterPage from "../pages/user/RegisterPage";
import ErrorPage from "../pages/user/ErrorPage";
import { LoginPageStyle1, LoginPageStyle2, LoginPageStyle3 } from "../pages/user/LoginPageStyle";

// ADMIN pages
import AdminDashboard from "../pages/admin/AdminDashboard";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <UserDashboardPage /> },
      { path: "map", element: <MapPage /> },
      { path: "bus", element: <BusPage /> },
      { path: "driver", element: <DriverPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/login1", element: <LoginPageStyle1 /> },
  { path: "/login2", element: <LoginPageStyle2 /> },
  { path: "/login3", element: <LoginPageStyle3 /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/admin", element: <AdminDashboard /> },
]);
