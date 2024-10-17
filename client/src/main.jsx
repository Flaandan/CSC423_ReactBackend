import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Login from "./login/Login.jsx";
import AdminDash from "./dashboards/adminDash.jsx";
import TeacherDash from "./dashboards/teacherDash.jsx";
import StudentDash from "./dashboards/studentDash.jsx";
//import Root from "./routes/root";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/AdminDash",
    element: <AdminDash />,
  },
  {
    path: "/studentDash",
    element: <StudentDash />,
  },
  {
    path: "/teacherDash",
    element: <TeacherDash />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
