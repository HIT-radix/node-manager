import { WalletDataState } from "@radixdlt/radix-dapp-toolkit";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppReducer } from "Types/reducers";

const initialState: AppReducer = {
  walletData: { accounts: [], personaData: [], proofs: [] },
  walletAddress: "",
  isNodeOwnerView: false,
};

const app = createSlice({
  name: "app",
  initialState,
  reducers: {
    setWalletData(state, action: PayloadAction<WalletDataState>) {
      state.walletData = action.payload;
      let accounts = action.payload.accounts;
      if (accounts.length > 0) {
        state.walletAddress = action.payload.accounts[0].address;
      } else {
        state.walletAddress = "";
      }
    },
    setIsNodeOwnerView(state, action: PayloadAction<boolean>) {
      state.isNodeOwnerView = action.payload;
    },
  },
});

export default app.reducer;

export const { setWalletData, setIsNodeOwnerView } = app.actions;
