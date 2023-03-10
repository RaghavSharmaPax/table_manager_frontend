import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  FormType,
  updateColumns,
  updateRows,
} from "../../utils/TableManager/utils";
import { getFormData, postData } from "./actions";

const initialState: {
  data: FormType;
  [key: string]: any;
} = {
  data: {
    username: "",
    dimensions: { rows: 0, cols: 0 },
    table: [],
  },
  toShow: {
    rows: 0,
    cols: 0,
  },
  loading: false,
  error: "",
};

const formReducer = createSlice({
  name: "form",
  initialState: initialState,
  reducers: {
    /**
     * @function updateUsername updates the username of the form
     * @param state current state of the formReducer
     * @param action contains a string representing the username
     */
    updateUsername(state, action: PayloadAction<string>) {
      state.data.username = action.payload;
    },
    /**
     * @function updateDimensions updates the dimensions of the table (row, col)
     * @param state current state of the formReducer
     * @param action contains object for number of rows and columns
     */
    updateDimensions(
      state,
      action: PayloadAction<{ rows: number; cols: number }>
    ) {
      const { rows: prev_rows, cols: prev_cols } = state.data.dimensions;
      const { rows: new_rows, cols: new_cols } = action.payload;
      const table = state.data.table;

      updateRows(table, state.toShow, prev_rows, new_rows, prev_cols);
      updateColumns(table, state.toShow, prev_cols, new_cols);

      state.data.dimensions = { rows: new_rows, cols: new_cols };
      state.data.table = table;
    },
    /**
     * @function updateTable updates the rows of the table
     * @param state current state of the form Reducer
     * @param action contains the table row to be updated and index of the row
     */
    updateTable(
      state,
      action: PayloadAction<{ tableRow: string[]; rowIdx: number }>
    ) {
      state.data.table[action.payload.rowIdx] = action.payload.tableRow;
    },
    /**
     * @function clearState resets the table state to empty values
     * @param state current state of the form Reducer
     */
    clearState(state) {
      state.data = {
        username: "",
        dimensions: { rows: 0, cols: 0 },
        table: [],
      };
      state.toShow = {
        rows: 0,
        cols: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postData.pending, (state, _action) => {
        state.loading = true;
      })
      .addCase(postData.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(postData.fulfilled, (state, _action) => {
        state.loading = false;
      })
      .addCase(getFormData.pending, (state, _action) => {
        state.loading = true;
      })
      .addCase(getFormData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.toShow = { ...action.payload.dimensions };
        state.loading = false;
      })
      .addCase(getFormData.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { updateUsername, updateDimensions, updateTable, clearState } =
  formReducer.actions;
export default formReducer.reducer;
