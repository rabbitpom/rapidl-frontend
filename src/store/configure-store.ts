import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
} from "redux-persist"
import storage from "redux-persist/lib/storage";

import tokenReducer from "./slices/token";
import userReducer from "./slices/user";

const combineReducer = combineReducers({
  tokenReducer,
  userReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, combineReducer);

const makeStore = () =>
  configureStore({
    reducer: persistedUserReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
  });

export const store = makeStore();
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;