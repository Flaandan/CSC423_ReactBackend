import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Login from './Login.jsx';
import AdminDash from './adminDash.jsx';
import TeacherDash from './teacherDash.jsx';
import StudentDash from './studentDash.jsx';
import Root from "./routes/root";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

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
    }
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)
