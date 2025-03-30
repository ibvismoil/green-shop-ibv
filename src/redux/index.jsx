import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./Counter";

const store = configureStore({
  reducer: {
    counter: counterSlice,
  },
});

export default store;
