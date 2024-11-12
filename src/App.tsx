import { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Routes from "./Routes";
import InputSearch from "Components/inputSearch";
import Header from "Layout/header";
import Footer from "Layout/footer";

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
      <Header />
      <InputSearch />
      <RouterProvider router={router} />
      <Footer />
    </>
  );
}

export default App;
