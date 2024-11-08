import { Oval } from "react-loader-spinner";
import { ToastOptions, toast } from "react-toastify";
import { NavigateFunction } from "react-router";

import { applicationName, networkId } from "Constants/misc";
import checkIcon from "Assets/Svgs/checkIcon.svg";
import errorIcon from "Assets/Svgs/txReject.svg";
import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";
import { DAPP_DEFINITION_ADDRESS } from "Constants/address";

const commonToastConfig: Partial<ToastOptions> = {
  position: "bottom-left",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  theme: "light",
  bodyClassName: "info-toast-body",
};

class Cache {
  navigation: NavigateFunction = () => {};
  isWalletConnected: boolean = false;
  gatewayApi = GatewayApiClient.initialize({
    networkId,
    applicationName,
    applicationVersion: "1",
    applicationDappDefinitionAddress: DAPP_DEFINITION_ADDRESS,
  });

  errorToast = (text: string | JSX.Element, options?: ToastOptions<{}>) =>
    toast.error(text, {
      ...commonToastConfig,
      bodyClassName: "",
      icon: ({ theme, type }) => (
        <img src={errorIcon} alt="checkIcon" style={{ marginTop: "3px" }} />
      ),
      style: {
        backgroundColor: "white",
      },
      ...options,
    });

  TxProgressToast = (text: string | JSX.Element, options?: ToastOptions<{}>) =>
    toast.error(text, {
      ...commonToastConfig,
      icon: ({ theme, type }) => (
        <Oval
          color="#293a24"
          secondaryColor="rgba(0, 0, 0, 0.2)"
          strokeWidth={7}
          width={25}
          height={25}
          wrapperStyle={{ marginTop: "3px" }}
        />
      ),
      style: {
        backgroundColor: "white",
      },
      autoClose: false,
      ...options,
    });

  successToast = (text: string | JSX.Element, options?: ToastOptions<{}>) =>
    toast.success(text, {
      ...commonToastConfig,
      icon: ({ theme, type }) => (
        <img src={checkIcon} alt="checkIcon" style={{ marginTop: "3px" }} />
      ),
      style: {
        backgroundColor: "white",
      },
      ...options,
    });
}

const CachedService = new Cache();

export default CachedService;
