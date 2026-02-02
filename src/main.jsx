import "@fontsource/roboto"; // Defaults to weight 400

import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./pages/layout/Layout.jsx";

import Admin from "./pages/admin/Admin.jsx";

import Home from "./pages/home/Home.jsx";
import Search from "./pages/search/Search.jsx";
import Login from "./pages/auth/login/Login.jsx";
import Register from "./pages/auth/register/Register.jsx";
import AdminRoute from "./components/navbar/adminroute/AdminRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index:true,
        element: <Home />,
      },
      {
        path:"home",
        element:<Home/>
      },

      {
        path: "search",
        element: <Search />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        element: <AdminRoute />,
        children: [
          {
            path: "admin",
            element: <Admin />,
          },
          
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />,
);
