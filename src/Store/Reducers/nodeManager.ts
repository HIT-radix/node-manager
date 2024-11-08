import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NodeManagerReducer } from "Types/reducers";

const initialState: NodeManagerReducer = {
  currentlyEarnedLockedLSUs: "0",
  ownerLSUsInUnlockingProcess: "0",
  totalStakedXrds: "0",
  totalXrdsLeavingOurNode: "0",
  unlockedLSUs: "0",
  unlockingLSUsBreakdown: [],
  epoch: 0,
};

const nodeManager = createSlice({
  name: "nodeManager",
  initialState,
  reducers: {
    setValidatorInfo(state, action: PayloadAction<NodeManagerReducer>) {
      state.currentlyEarnedLockedLSUs = action.payload.currentlyEarnedLockedLSUs;
      state.ownerLSUsInUnlockingProcess = action.payload.ownerLSUsInUnlockingProcess;
      state.totalStakedXrds = action.payload.totalStakedXrds;
      state.totalXrdsLeavingOurNode = action.payload.totalXrdsLeavingOurNode;
      state.unlockingLSUsBreakdown = action.payload.unlockingLSUsBreakdown;
      state.epoch = action.payload.epoch;
      state.unlockedLSUs = action.payload.unlockedLSUs;
    },
  },
});

export default nodeManager.reducer;

export const { setValidatorInfo } = nodeManager.actions;
