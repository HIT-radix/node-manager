import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NodeManagerReducer } from "Types/reducers";

const initialState: NodeManagerReducer = {
  validatorAddress: "",
  currentlyEarnedLockedLSUs: "0",
  ownerLSUsInUnlockingProcess: "0",
  totalStakedXrds: "0",
  totalXrdsLeavingOurNode: "0",
  unlockedLSUs: "0",
  unlockingLSUsBreakdown: [],
  epoch: 0,
  metadata: {},
  stakeUnitAddress: "",
  vaults: {
    NODE_CURRENTLY_EARNED_LSU_VAULT_ADDRESS: "",
    NODE_OWNER_UNLOCKING_LSU_VAULT_ADDRESS: "",
    NODE_TOTAL_STAKED_XRD_VAULT_ADDRESS: "",
    NODE_UNSTAKING_XRD_VAULT_ADDRESS: "",
  },
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
      state.metadata = action.payload.metadata;
      state.stakeUnitAddress = action.payload.stakeUnitAddress;
      state.vaults = action.payload.vaults;
      state.validatorAddress = action.payload.validatorAddress;
    },
    clearValidatorInfo(state) {
      state.currentlyEarnedLockedLSUs = "0";
      state.ownerLSUsInUnlockingProcess = "0";
      state.totalStakedXrds = "0";
      state.totalXrdsLeavingOurNode = "0";
      state.unlockedLSUs = "0";
      state.unlockingLSUsBreakdown = [];
      state.epoch = 0;
      state.metadata = {};
      state.stakeUnitAddress = "";
      state.vaults = {
        NODE_CURRENTLY_EARNED_LSU_VAULT_ADDRESS: "",
        NODE_OWNER_UNLOCKING_LSU_VAULT_ADDRESS: "",
        NODE_TOTAL_STAKED_XRD_VAULT_ADDRESS: "",
        NODE_UNSTAKING_XRD_VAULT_ADDRESS: "",
      };
      state.validatorAddress = "";
    },
  },
});

export default nodeManager.reducer;

export const { setValidatorInfo, clearValidatorInfo } = nodeManager.actions;
