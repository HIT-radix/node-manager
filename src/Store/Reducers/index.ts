import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createAction } from "@reduxjs/toolkit";

import app from "./app";
import session from "./session";
import loadings from "./loadings";
import nodeManager from "./nodeManager";
import recentTxs from "./recentTxs";

const persistConfig = {
  version: 1,
  key: "node-manager-ts",
  storage,
  whitelist: ["app"],
};

export const logout = createAction("USER_LOGOUT");

const reducers = combineReducers({
  app,
  session,
  loadings,
  nodeManager,
  recentTxs,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "USER_LOGOUT") {
    localStorage.removeItem("persist:hit-staking-ts");
    return reducers(undefined, action);
  }
  return reducers(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
