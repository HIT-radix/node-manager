import { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Routes from "./Routes";

function App() {
  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: "/*",
          element: <Routes />,
          errorElement: <></>,
        },
      ]),
    []
  );
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
