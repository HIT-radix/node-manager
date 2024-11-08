import CachedService from "Classes/cachedService";
import { useLocation } from "react-router-dom";
import { useSelector } from "Store";

const NavbarLinks = () => {
  const path = useLocation();
  const isOwner = useSelector((state) => state.staking.isOwner);
  const checkIfActive = (route: string) => path.pathname === route;
  const moveToPage = (route: string) => {
    CachedService.navigation(route);
  };
  return (
    <>
      {isOwner && (
        <p
          className={
            "cursor-pointer hover:underline hover:text-accent " +
            (checkIfActive("/admin") ? "text-accent underline" : "text-secondary")
          }
          onClick={() => moveToPage("/admin")}
        >
          Admin
        </p>
      )}
      <p
        className={
          "cursor-pointer hover:underline hover:text-accent " +
          (checkIfActive("/") ? "text-accent underline" : "text-secondary")
        }
        onClick={() => moveToPage("/")}
      >
        Stake HIT
      </p>
      <p
        className={
          "cursor-pointer hover:underline hover:text-accent " +
          (checkIfActive("/staking") ? "text-accent underline" : "text-secondary")
        }
        onClick={() => moveToPage("/staking")}
      >
        Validator Staking
      </p>
    </>
  );
};

export default NavbarLinks;
