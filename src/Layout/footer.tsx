import { FunctionComponent } from "react";

import XLogo from "Assets/Svgs/x.svg";
import TelegramLogo from "Assets/Svgs/telegram.svg";
import GitbookLogo from "Assets/Svgs/gitbook.svg";
import { HIT_WEBSITE, TELEGRAM_LINK, X_HANDLE } from "Constants/misc";

const Footer: FunctionComponent = () => {
  return (
    <div className="flex items-center justify-center gap-6 h-[50px]">
      <a href={TELEGRAM_LINK} target="blank" className="cursor-pointer">
        <img src={TelegramLogo} width={20} height={20} alt="telegram-icon" />
      </a>
      <a href={X_HANDLE} target="blank" className="cursor-pointer">
        <img src={XLogo} width={20} height={20} alt="x-icon" />
      </a>
      <a href={HIT_WEBSITE} target="blank" className="cursor-pointer">
        <img src={GitbookLogo} width={24} height={24} alt="gitbook-icon" />
      </a>
    </div>
  );
};

export default Footer;
