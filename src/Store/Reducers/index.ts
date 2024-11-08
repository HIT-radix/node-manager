import { combineReducers } from "redux";
import { createMigrate, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createAction } from "@reduxjs/toolkit";

import app from "./app";
import session from "./session";
import loadings from "./loadings";
import staking from "./staking";
import nodeManager from "./nodeManager";

const persistConfig = {
  version: 1,
  key: "hit-staking-ts",
  storage,
  whitelist: ["app"],
  migrate: createMigrate({
    1: (state: any) => ({
      ...state,
      app: {
        ...state.app,
        fomoPrice: 0,
      },
    }),
  }),
};

export const logout = createAction("USER_LOGOUT");

const reducers = combineReducers({
  app,
  session,
  loadings,
  staking,
  nodeManager,
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
