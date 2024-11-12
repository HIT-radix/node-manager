import { lazy } from "react";
import { useNavigate, useRoutes, Navigate } from "react-router-dom";

import CachedService from "Classes/cachedService";

const Home = lazy(() => import("Pages/Home"));
const Node = lazy(() => import("Pages/Node"));

export default function Routes() {
  const navigate = useNavigate();
  CachedService.navigation = navigate;

  return useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/node/:id",
      element: <Node />,
    },
    { path: "*", element: <Navigate to={"/"} replace={true} /> },
  ]);
}
