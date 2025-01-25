import { WalletDataState } from "@radixdlt/radix-dapp-toolkit";
import { FeeFactor, UnlockingRewards, UnstakeClaimNFTDATA, ValidatorItem } from "./api";

export type AppReducer = {
  walletData: WalletDataState;
  walletAddress: string;
  isNodeOwnerView: boolean;
};

export type FungibleBalances = Record<string, { tokenAddress: string; amount: string }>;

export type NonFungibleBalances = Record<string, { collectionAddress: string; ids: string[] }>;

export enum Percentage {
  _0 = 0,
  _10 = 0.1,
  _25 = 0.25,
  _50 = 0.5,
  _75 = 0.75,
  _100 = 1,
}

export enum Tabs {
  stake = "stake",
  unstake = "unstake",
  claim = "claim",
}

export type NodeManagerReducer = {
  validatorAddress: string;
  ownerLSUsInUnlockingProcess: string;
  currentlyEarnedLockedLSUs: string;
  totalXrdsLeavingOurNode: string;
  totalStakedXrds: string;
  unlockedLSUs: string;
  unlockingLSUsBreakdown: UnlockingRewards;
  epoch: number;
  metadata: Record<string, string>;
  stakeUnitAddress: string;
  vaults: {
    NODE_CURRENTLY_EARNED_LSU_VAULT_ADDRESS: string;
    NODE_OWNER_UNLOCKING_LSU_VAULT_ADDRESS: string;
    NODE_TOTAL_STAKED_XRD_VAULT_ADDRESS: string;
    NODE_UNSTAKING_XRD_VAULT_ADDRESS: string;
  };
  fees: FeeFactor;
};

export enum StakingTokens {
  HIT = "HIT",
  StHIT = "StHIT",
  FOMO = "FOMO",
  XRD = "XRD",
  LSU = "LSU",
}

export type SessionReducer = {
  successTxCount: number;
  userBalances: {
    fungible: FungibleBalances;
    nonFungible: NonFungibleBalances;
  };
  useUnstakeClaimNFTs: UnstakeClaimNFTDATA;
  isOwner: boolean;
  validatorsList: ValidatorItem[];
  inputSearch: string;
  validatorInfoFound: boolean;
  userValidatorsList: ValidatorItem[];
  isTop100View: boolean;
  warningModalMessage: string;
};

export type LoadingReducer = {
  balanceLoading: boolean;
  txInProgress: boolean;
  validatorDataLoading: boolean;
  unstakeClaimNFtsDataLoading: boolean;
  validatorsListLoading: boolean;
};
