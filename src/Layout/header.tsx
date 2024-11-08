import ImageAudioPlayer from "Components/audioplayer";
import { HIT_WEBSITE } from "Constants/misc";
import NavbarLinks from "Components/navbarLinks";

const Header = () => {
  return (
    <div
      className="flex flex-row justify-between items-center w-full p-4 px-2 sm:px-14 h-[90px]"
      style={{}}
    >
      <div className="flex gap-12 items-center">
        <LogoWebsite />
      </div>
      <div className="flex-row items-center gap-8 text-xl hidden md:flex">
        <NavbarLinks />
      </div>
      <div className="flex items-center justify-center gap-9">
        <p
          className="text-accent font-bold text-lg cursor-pointer hidden sm:block"
          onClick={() => window.open(HIT_WEBSITE, "_blank")}
        >
          Docs
        </p>
        <radix-connect-button></radix-connect-button>
      </div>
    </div>
  );
};

const LogoWebsite = ({ twContainerClass = "" }: { twContainerClass?: string }) => {
  return (
    <div className={"flex flex-row items-center " + twContainerClass}>
      <ImageAudioPlayer />
      {/* <img src={HitLogo} alt="mesh-logo" className="w-10" /> */}
      <div>
        <p className="hidden sm:block text-accent text-2xl font-bold pl-2">Node Manager</p>
        <p className="hidden sm:block text-accent text-sm font-bold pl-2 opacity-60">By ADDIX</p>
      </div>
    </div>
  );
};

export default Header;
