import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import newsSlice from "./slices/newsSlice";
import adminSlice from "./slices/adminSlice";
import themeSlice from "./slices/themeSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    news: newsSlice,
    admin: adminSlice,
    theme: themeSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
