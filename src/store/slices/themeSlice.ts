import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  systemTheme: "light" | "dark";
  resolvedTheme: "light" | "dark";
}

// Helper function to get system theme
const getSystemTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

// Helper function to get stored theme
const getStoredTheme = (): Theme => {
  if (typeof window !== "undefined") {
const stored = localStorage.getItem("upuday-theme") as Theme;
    if (stored && ["light", "dark", "system"].includes(stored)) {
      return stored;
    }
  }
  return "system";
};

// Helper function to resolve theme
const resolveTheme = (
  theme: Theme,
  systemTheme: "light" | "dark",
): "light" | "dark" => {
  return theme === "system" ? systemTheme : theme;
};

const systemTheme = getSystemTheme();
const storedTheme = getStoredTheme();

const initialState: ThemeState = {
  theme: storedTheme,
  systemTheme,
  resolvedTheme: resolveTheme(storedTheme, systemTheme),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      state.resolvedTheme = resolveTheme(action.payload, state.systemTheme);

      // Persist to localStorage
      if (typeof window !== "undefined") {
      localStorage.setItem("upuday-theme", action.payload);

        // Apply theme to document
        const root = document.documentElement;
        if (state.resolvedTheme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    },
    setSystemTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.systemTheme = action.payload;
      state.resolvedTheme = resolveTheme(state.theme, action.payload);

      // Apply theme if using system preference
      if (state.theme === "system" && typeof window !== "undefined") {
        const root = document.documentElement;
        if (state.resolvedTheme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    },
    initializeTheme: (state) => {
      // Apply initial theme to document
      if (typeof window !== "undefined") {
        const root = document.documentElement;
        // Use Tailwind's dark class for theming; no light class is needed
        if (state.resolvedTheme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    },
  },
});

export const { setTheme, setSystemTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
