import { ReactNode } from "react";

import Header from "./header";
import Footer from "./footer";
import InputSearch from "Pages/Home/components/inputSearch";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <InputSearch />
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
