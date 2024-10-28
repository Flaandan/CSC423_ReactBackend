import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login.jsx";
import AdminDash from "./pages/admin/AdminDashboard.jsx";
import StudentDash from "./pages/student/StudentDashboard.jsx";
import TeacherDash from "./pages/teacher/TeacherDashboard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <AdminDash />,
  },
  {
    path: "/student",
    element: <StudentDash />,
  },
  {
    path: "/teacher",
    element: <TeacherDash />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
