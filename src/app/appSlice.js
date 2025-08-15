import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchGoogleSheet } from "../components/services/googleSheet";

// Async thunk to fetch and set sheet data
export const fetchSheetData = createAsyncThunk(
  "app/fetchSheetData",
  async (url) => {
    const data = await fetchGoogleSheet(url);
    return data;
  }
);

export const appSlice = createSlice({
  name: "app",
  initialState: {
    isLoading: true,
    currentLang: "fi",
    isModal: false,
    data: [],
  },
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setCurrentLang(state, action) {
      state.currentLang = action.payload;
    },
    toggleIsModal(state) {
      state.isModal = !state.isModal;
    },
    togglePicModal(state) {
      state.isPicModal = !state.isPicModal;
    },
    setSheetData(state, action) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSheetData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSheetData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchSheetData.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setIsLoading,
  setCurrentLang,
  toggleIsModal,
  togglePicModal,
  setSheetData,
} = appSlice.actions;

export default appSlice.reducer;