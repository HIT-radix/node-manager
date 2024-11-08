import { StakingTokens } from "./reducers";

export type PeriodicData = {
  "1h": string;
  "24h": string;
  "7d": string;
  now: string;
};

export type PeriodicUSD_XRD = {
  usd: PeriodicData;
  xrd: PeriodicData;
};

type Liquidity = {
  token: PeriodicData;
} & PeriodicUSD_XRD;

interface MarketCap {
  circulating: PeriodicUSD_XRD;
  fully_diluted: PeriodicUSD_XRD;
}

type Price = PeriodicUSD_XRD;

interface Supply {
  burnable: boolean;
  circulating: string;
  divisbility: number;
  mintable: boolean;
  total: string;
}

type TotalValueLocked = {
  token: PeriodicData;
} & PeriodicUSD_XRD;

type Volume = {
  token: PeriodicData;
} & PeriodicUSD_XRD;

export interface TokenData {
  address: string;
  description: string;
  icon_url: string;
  links: string[]; // Array of links type not provided
  liquidity: Liquidity;
  listed_at: string;
  market_cap: MarketCap;
  name: string;
  price: Price;
  rank: number;
  slug: string;
  supply: Supply;
  symbol: string;
  total_value_locked: TotalValueLocked;
  volume: Volume;
}

export type RewardTokenDistribution = {
  id: number;
  amount: string;
};

export type ClaimableRewardsInfo = Partial<Record<StakingTokens, string>>;
