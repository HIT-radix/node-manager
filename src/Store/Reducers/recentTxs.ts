import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecentStakingTx } from "Types/api";
import { RecentTxReducer } from "Types/reducers";

const initialState: RecentTxReducer = {};

const recentTxs = createSlice({
  name: "recentTxs",
  initialState,
  reducers: {
    setRecentTx(state, action: PayloadAction<{ nodeAddress: string; txData: RecentStakingTx[] }>) {
      const { payload } = action;
      if (!state[payload.nodeAddress]) {
        state[payload.nodeAddress] = [];
      }
      state[payload.nodeAddress] = payload.txData;
    },
  },
});

export default recentTxs.reducer;

export const { setRecentTx } = recentTxs.actions;
