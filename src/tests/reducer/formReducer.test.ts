import "@testing-library/jest-dom";
import axios from "axios";
import * as utils from "../../utils/TableManager/utils";
import store from "../../redux";
import {
  downloadTable,
  getTableData,
  postData,
} from "../../redux/formReducer/actions";
import reducer, {
  clearState,
  updateDimensions,
  updateTable,
  updateTableName,
} from "../../redux/formReducer/reducer";
import { TableType } from "../../utils/TableManager/utils";
const defState: {
  data: TableType;
  [key: string]: any;
} = {
  data: {
    tableName: "",
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

describe("Test Form Reducer", () => {
  test("initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual(defState);
  });
  test("update username", () => {
    expect(reducer(defState, updateTableName("rag"))).toEqual({
      ...defState,
      data: { ...defState.data, tableName: "rag" },
    });
  });
  test("update dimensions", () => {
    expect(reducer(defState, updateDimensions({ rows: 2, cols: 3 }))).toEqual({
      ...defState,
      data: {
        ...defState.data,
        dimensions: { rows: 2, cols: 3 },
        table: [
          ["", "", ""],
          ["", "", ""],
        ],
      },
      toShow: {
        rows: 2,
        cols: 3,
      },
    });
  });

  test("update table", () => {
    const prevState = JSON.parse(JSON.stringify(defState));
    prevState.data.dimensions.cols = 3;
    prevState.data.dimensions.rows = 2;
    prevState.toShow.rows = 2;
    prevState.toShow.cols = 3;
    prevState.data.table = [
      ["", "", ""],
      ["", "", ""],
    ];
    expect(
      reducer(
        prevState,
        updateTable({ newValue: "update", rowIdx: 0, colIdx: 0 })
      )
    ).toEqual({
      ...prevState,
      data: {
        ...prevState.data,
        table: [
          ["update", "", ""],
          ["", "", ""],
        ],
      },
    });
  });

  test("clear state", () => {
    const prevState = JSON.parse(JSON.stringify(defState));
    prevState.data.dimensions.cols = 3;
    prevState.data.dimensions.rows = 2;
    prevState.toShow.rows = 2;
    prevState.toShow.cols = 3;
    prevState.data.table = [
      ["", "", ""],
      ["", "", ""],
    ];

    expect(reducer(prevState, clearState)).toEqual(defState);
  });

  describe("running post test", () => {
    const Store = store;

    test("post data", async () => {
      const postSpy = jest.spyOn(axios, "post").mockResolvedValueOnce({
        data: {
          tableName: "first table",
          dimensions: {
            rows: 2,
            cols: 2,
          },
          table: [["abcd", "hi"]],
        },
      });

      const validateSpy = jest
        .spyOn(utils, "validateData")
        .mockImplementationOnce(() => true);

      await Store.dispatch(postData());
      expect(validateSpy).toBeCalled();
      expect(postSpy).toBeCalled();
    });
  });

  test("get table data", async () => {
    const getSpy = jest.spyOn(axios, "get").mockResolvedValueOnce({
      data: {
        tableName: "first table",
        dimensions: {
          rows: 4,
          cols: 4,
          _id: "6422ccd6d6daa09f0552b26c",
        },
        table: [
          ["a", "", "", ""],
          ["", "very", "", ""],
          ["", "", "nice ", ""],
          ["noice", "", "", "table"],
        ],
      },
    });

    const Store = store;
    await Store.dispatch(getTableData("first table"));
    expect(getSpy).toBeCalled();
    expect(Store.getState().form.data).toEqual({
      tableName: "first table",
      dimensions: {
        rows: 4,
        cols: 4,
        _id: "6422ccd6d6daa09f0552b26c",
      },
      table: [
        ["a", "", "", ""],
        ["", "very", "", ""],
        ["", "", "nice ", ""],
        ["noice", "", "", "table"],
      ],
    });
  });

  test("download table", async () => {
    const getSpy = jest.spyOn(axios, "get").mockRejectedValueOnce({});

    const Store = store;
    await Store.dispatch(downloadTable());

    expect(getSpy).toBeCalled();
  });
});