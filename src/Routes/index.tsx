import { lazy } from "react";
import { useNavigate, useRoutes, Navigate } from "react-router-dom";

import CachedService from "Classes/cachedService";
import MainLayout from "Layout/mainLayout";

const Home = lazy(() => import("Pages/Home"));
const Node = lazy(() => import("Pages/Node"));

export default function Routes() {
  const navigate = useNavigate();
  CachedService.navigation = navigate;

  return useRoutes([
    {
      path: "/",
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      ),
    },
    {
      path: "/node/:id",
      element: (
        <MainLayout>
          <Node />
        </MainLayout>
      ),
    },
    { path: "*", element: <Navigate to={"/"} replace={true} /> },
  ]);
}
