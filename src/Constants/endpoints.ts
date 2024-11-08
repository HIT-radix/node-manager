import { Environment } from "Types/misc";

export const Ociswap_baseurl = "https://api.ociswap.com";

export const networkRPC =
  process.env.REACT_APP_ENVIRONMENT === Environment.dev
    ? "https://babylon-stokenet-gateway.radixdlt.com"
    : "https://mainnet.radixdlt.com";

// export const HIT_SERVER_URL =
//   process.env.REACT_APP_ENVIRONMENT === Environment.dev
//     ? "http://localhost:3002"
//     : "https://bot.addix.meme";

export const HIT_SERVER_URL = "https://bot.addix.meme";
