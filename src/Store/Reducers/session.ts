import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UnstakeClaimNFTDATA, ValidatorItem } from "Types/api";
import { SessionReducer } from "Types/reducers";

const initialState: SessionReducer = {
  successTxCount: 0,
  userBalances: {
    fungible: {},
    nonFungible: {},
  },
  isOwner: false,
  useUnstakeClaimNFTs: {},
  validatorsList: [],
  inputSearch: "",
  validatorInfoFound: true,
  userValidatorsList: [],
  isTop100View: true,
  warningModalMessage: "",
};

const session = createSlice({
  name: "session",
  initialState,
  reducers: {
    incrementSuccessTxCount(state) {
      state.successTxCount = state.successTxCount + 1;
    },
    setWarningModalMessage(state, action: PayloadAction<string>) {
      state.warningModalMessage = action.payload;
    },
    setIsTop100View(state, action: PayloadAction<boolean>) {
      state.isTop100View = action.payload;
    },
    setUserValidatorList(state, action: PayloadAction<ValidatorItem[]>) {
      state.userValidatorsList = action.payload;
    },
    setValidatorInfoFound(state, action: PayloadAction<boolean>) {
      state.validatorInfoFound = action.payload;
    },
    setUserBalances(state, action: PayloadAction<SessionReducer["userBalances"]>) {
      state.userBalances = action.payload;
    },
    setIsOwner(state, action: PayloadAction<boolean>) {
      state.isOwner = action.payload;
    },
    setUnstakeClaimNFTsData(state, action: PayloadAction<UnstakeClaimNFTDATA>) {
      state.useUnstakeClaimNFTs = action.payload;
    },
    setValidatorsList(state, action: PayloadAction<ValidatorItem[]>) {
      state.validatorsList = action.payload;
    },
    setInputSearch(state, action: PayloadAction<string>) {
      state.inputSearch = action.payload;
    },
  },
});

export default session.reducer;

export const {
  setWarningModalMessage,
  incrementSuccessTxCount,
  setValidatorInfoFound,
  setUserBalances,
  setIsOwner,
  setUnstakeClaimNFTsData,
  setValidatorsList,
  setInputSearch,
  setUserValidatorList,
  setIsTop100View,
} = session.actions;
