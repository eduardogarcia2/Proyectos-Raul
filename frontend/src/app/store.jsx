import { configureStore } from "@reduxjs/toolkit";
import curriculumSlice from "../features/curriculumSlice";

const store = configureStore({
  reducer: {
    curriKey: curriculumSlice,
  },
});

export default store;