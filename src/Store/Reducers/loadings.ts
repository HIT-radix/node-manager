import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoadingReducer } from "Types/reducers";

const initialState: LoadingReducer = {
  balanceLoading: false,
  txInProgress: false,
  validatorDataLoading: false,
  unstakeClaimNFtsDataLoading: false,
  validatorsListLoading: false,
  recentNodeTxLoading: false,
};

const loadings = createSlice({
  name: "loadings",
  initialState,
  reducers: {
    setBalanceLoading(state, action: PayloadAction<boolean>) {
      state.balanceLoading = action.payload;
    },
    setTxInProgress(state, action: PayloadAction<boolean>) {
      state.txInProgress = action.payload;
    },
    setValidatorDataLoading(state, action: PayloadAction<boolean>) {
      state.validatorDataLoading = action.payload;
    },
    setUnstakeClaimNFtsDataLoading(state, action: PayloadAction<boolean>) {
      state.unstakeClaimNFtsDataLoading = action.payload;
    },
    setValidatorsListLoading(state, action: PayloadAction<boolean>) {
      state.validatorsListLoading = action.payload;
    },
    setRecentNodeTxLoading(state, action: PayloadAction<boolean>) {
      state.recentNodeTxLoading = action.payload;
    },
  },
});

export default loadings.reducer;

export const {
  setBalanceLoading,
  setTxInProgress,
  setValidatorDataLoading,
  setUnstakeClaimNFtsDataLoading,
  setValidatorsListLoading,
  setRecentNodeTxLoading,
} = loadings.actions;
