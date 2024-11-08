import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { SessionReducer } from "Types/reducers";
import { TokenData } from "Types/token";

const initialState: SessionReducer = {
  successTxCount: 0,
  tokenData: undefined,
  hitBalance: "0",
  fomoBalance: "0",
  fomoTokenData: undefined,
  rewardsModalData: undefined,
};

const session = createSlice({
  name: "session",
  initialState,
  reducers: {
    incrementSuccessTxCount(state) {
      state.successTxCount = state.successTxCount + 1;
    },
    updateTokenData(state, action: PayloadAction<TokenData>) {
      state.tokenData = action.payload;
    },
    setHitBalance(state, action: PayloadAction<string>) {
      state.hitBalance = action.payload;
    },
    setFomoBalance(state, action: PayloadAction<string>) {
      state.fomoBalance = action.payload;
    },
    updateHitFomoData(state, action: PayloadAction<{ hit?: TokenData; fomo?: TokenData }>) {
      if (action.payload.hit) {
        state.tokenData = action.payload.hit;
      }
      if (action.payload.fomo) {
        state.fomoTokenData = action.payload.fomo;
      }
    },
    setRewardsModalData(state, action: PayloadAction<SessionReducer["rewardsModalData"]>) {
      state.rewardsModalData = action.payload;
    },
  },
});

export default session.reducer;

export const {
  incrementSuccessTxCount,
  updateTokenData,
  setHitBalance,
  setFomoBalance,
  updateHitFomoData,
  setRewardsModalData,
} = session.actions;
