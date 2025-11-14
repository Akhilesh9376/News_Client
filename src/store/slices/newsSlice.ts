import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NewsState, Article, Category } from "@/types";

const initialState: NewsState = {
  articles: [],
  categories: [
    { id: "1", name: "Politics", slug: "politics", color: "bg-red-500" },
    { id: "2", name: "Technology", slug: "technology", color: "bg-blue-500" },
    { id: "3", name: "Sports", slug: "sports", color: "bg-green-500" },
    { id: "4", name: "Business", slug: "business", color: "bg-yellow-500" },
    {
      id: "5",
      name: "Entertainment",
      slug: "entertainment",
      color: "bg-purple-500",
    },
    { id: "6", name: "Health", slug: "health", color: "bg-pink-500" },
  ],
  isLoading: false,
  error: null,
  filters: {
    category: "",
    search: "",
  },
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setArticles: (state, action: PayloadAction<Article[]>) => {
      state.articles = action.payload;
      state.isLoading = false;
    },
    appendArticles: (state, action: PayloadAction<Article[]>) => {
      const combined = [...state.articles, ...action.payload];
      // Deduplicate by id
      const deduped = combined.filter(
        (article, index, self) =>
          self.findIndex((a) => a.id === article.id) === index,
      );
      state.articles = deduped;
      state.isLoading = false;
    },
    addArticle: (state, action: PayloadAction<Article>) => {
      state.articles.unshift(action.payload);
    },
    updateArticle: (state, action: PayloadAction<Article>) => {
      const index = state.articles.findIndex(
        (article) => article.id === action.payload.id,
      );
      if (index !== -1) {
        state.articles[index] = action.payload;
      }
    },
    deleteArticle: (state, action: PayloadAction<string>) => {
      state.articles = state.articles.filter(
        (article) => article.id !== action.payload,
      );
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<typeof initialState.filters>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setArticles,
  appendArticles,
  addArticle,
  updateArticle,
  deleteArticle,
  setFilters,
  setError,
} = newsSlice.actions;
export default newsSlice.reducer;
