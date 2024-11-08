import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoadingReducer } from "Types/reducers";

const initialState: LoadingReducer = {
  balanceLoading: false,
  txInProgress: false,
  tokenDataLoading: false,
  poolDataLoading: false,
  rugProofComponentDataLoading: false,
  stHitDataLoading: false,
  findingNodeNFT: false,
  nodeStakingRewards: false,
  nodeStakingComponentDataLoading: false,
  validatorDataLoading: false,
};

const loadings = createSlice({
  name: "loadings",
  initialState,
  reducers: {
    setNodeStakingRewardsLoading(state, action: PayloadAction<boolean>) {
      state.nodeStakingRewards = action.payload;
    },
    setBalanceLoading(state, action: PayloadAction<boolean>) {
      state.balanceLoading = action.payload;
    },
    setFindingNodeNFT(state, action: PayloadAction<boolean>) {
      state.findingNodeNFT = action.payload;
    },
    setTxInProgress(state, action: PayloadAction<boolean>) {
      state.txInProgress = action.payload;
    },
    setTokenDataLoading(state, action: PayloadAction<boolean>) {
      state.tokenDataLoading = action.payload;
    },
    setPoolDataLoading(state, action: PayloadAction<boolean>) {
      state.poolDataLoading = action.payload;
    },
    setRugProofComponentDataLoading(state, action: PayloadAction<boolean>) {
      state.rugProofComponentDataLoading = action.payload;
    },
    setStHitDataLoading(state, action: PayloadAction<boolean>) {
      state.stHitDataLoading = action.payload;
    },
    setNodeStakingComponentDataLoading(state, action: PayloadAction<boolean>) {
      state.nodeStakingComponentDataLoading = action.payload;
    },
    setValidatorDataLoading(state, action: PayloadAction<boolean>) {
      state.validatorDataLoading = action.payload;
    },
  },
});

export default loadings.reducer;

export const {
  setStHitDataLoading,
  setBalanceLoading,
  setTxInProgress,
  setTokenDataLoading,
  setPoolDataLoading,
  setRugProofComponentDataLoading,
  setFindingNodeNFT,
  setNodeStakingRewardsLoading,
  setNodeStakingComponentDataLoading,
  setValidatorDataLoading,
} = loadings.actions;
