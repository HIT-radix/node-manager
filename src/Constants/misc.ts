import { RadixNetwork } from "@radixdlt/radix-dapp-toolkit";
import { Environment } from "Types/misc";

export const TELEGRAM_LINK = "https://t.me/addixanonymous";
export const X_HANDLE = "https://twitter.com/addix_xrd";
export const HIT_WEBSITE = "https://addix-xrd.gitbook.io/usdhit-on-radix/";

export const AMOUNT_INPUT_REGEX = /^((\d+[.]?\d*)|(\.\d+))$/;

export const radixDashboardBaseUrl =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "https://stokenet-dashboard.radixdlt.com"
    : "https://dashboard.radixdlt.com";

export const networkId =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? RadixNetwork.Stokenet
    : RadixNetwork.Mainnet;

export const applicationName =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev ? "HIT Test Staking" : "HIT Staking";
