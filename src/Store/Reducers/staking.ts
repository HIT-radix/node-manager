import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Percentage, StakingReducer, Tabs } from "Types/reducers";

const initialState: StakingReducer = {
  currentTab: Tabs.stake,
  amount: "",
  percentage: Percentage._0,
  isInSufficientBalance: false,
  stHitBalance: "0",
  stHIT_totalSupply: "0",
  stakedHIT: "0",
  lockedHITRewards: "0",
  isOwner: false,
  NodeStakeNFTid: undefined,
  lockedNodeStakingFomos: "0",
  lockedNodeStakingHits: "0",
  // oldLockedNodeStakingFomos: "0",
};

const staking = createSlice({
  name: "staking",
  initialState,
  reducers: {
    setCurrentTab(state, action: PayloadAction<Tabs>) {
      state.currentTab = action.payload;
    },
    setNodeStakeNFTid(state, action: PayloadAction<number | undefined>) {
      state.NodeStakeNFTid = action.payload;
    },
    setAmount(state, action: PayloadAction<string>) {
      state.amount = action.payload;
    },
    setIsOwner(state, action: PayloadAction<boolean>) {
      state.isOwner = action.payload;
    },
    setPercentage(state, action: PayloadAction<Percentage>) {
      state.percentage = action.payload;
    },
    setIsInsufficientBalance(state, action: PayloadAction<boolean>) {
      if (state.isInSufficientBalance !== action.payload) {
        state.isInSufficientBalance = action.payload;
      }
    },
    setStHitBalance(state, action: PayloadAction<string>) {
      state.stHitBalance = action.payload;
    },
    setStHitTotalSupply(state, action: PayloadAction<string>) {
      state.stHIT_totalSupply = action.payload;
    },
    setStakedHIT(state, action: PayloadAction<string>) {
      state.stakedHIT = action.payload;
    },
    setLockedHITRewards(state, action: PayloadAction<string>) {
      state.lockedHITRewards = action.payload;
    },
    setLockedNodeStakingFomos(state, action: PayloadAction<string>) {
      state.lockedNodeStakingFomos = action.payload;
    },
    // setOldLockedNodeStakingFomos(state, action: PayloadAction<string>) {
    //   state.oldLockedNodeStakingFomos = action.payload;
    // },
    setLockedNodeStakingHits(state, action: PayloadAction<string>) {
      state.lockedNodeStakingHits = action.payload;
    },
  },
});

export default staking.reducer;

export const {
  setIsOwner,
  setLockedHITRewards,
  setCurrentTab,
  setAmount,
  setPercentage,
  setIsInsufficientBalance,
  setStHitBalance,
  setStHitTotalSupply,
  setStakedHIT,
  setNodeStakeNFTid,
  setLockedNodeStakingFomos,
  setLockedNodeStakingHits,
  // setOldLockedNodeStakingFomos,
} = staking.actions;
