import { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="px-2 flex items-center justify-center ">
      <div className="max-w-4xl w-full">{children}</div>
    </div>
  );
};

export default MainLayout;
