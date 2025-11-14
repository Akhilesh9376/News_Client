import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminState, User, Article } from "@/types";

const initialState: AdminState = {
  employees: [],
  pendingArticles: [],
  statistics: {
    totalArticles: 0,
    totalEmployees: 0,
    pendingApprovals: 0,
    publishedToday: 0,
  },
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setEmployees: (state, action: PayloadAction<User[]>) => {
      state.employees = action.payload;
    },
    addEmployee: (state, action: PayloadAction<User>) => {
      state.employees.push(action.payload);
    },
    removeEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter(
        (emp) => emp.id !== action.payload,
      );
    },
    blockEmployee: (state, action: PayloadAction<string>) => {
      const employee = state.employees.find((emp) => emp.id === action.payload);
      if (employee) {
        employee.isBlocked = true;
      }
    },
    setPendingArticles: (state, action: PayloadAction<Article[]>) => {
      state.pendingArticles = action.payload;
    },
    approveArticle: (state, action: PayloadAction<string>) => {
      state.pendingArticles = state.pendingArticles.filter(
        (article) => article.id !== action.payload,
      );
    },
    rejectArticle: (
      state,
      action: PayloadAction<{ id: string; reason: string }>,
    ) => {
      state.pendingArticles = state.pendingArticles.filter(
        (article) => article.id !== action.payload.id,
      );
    },
    setStatistics: (
      state,
      action: PayloadAction<typeof initialState.statistics>,
    ) => {
      state.statistics = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setEmployees,
  addEmployee,
  removeEmployee,
  blockEmployee,
  setPendingArticles,
  approveArticle,
  rejectArticle,
  setStatistics,
  setError,
} = adminSlice.actions;
export default adminSlice.reducer;
