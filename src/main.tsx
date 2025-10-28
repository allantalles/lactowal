import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./templates/App";
import Home from "./pages/HomePage";
import Export from "./pages/ExportData";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  { path: "/game", element: <App /> },
  { path: "/exportar", element: <Export /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
