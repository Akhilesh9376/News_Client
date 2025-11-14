import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { initializeTheme, setSystemTheme } from "@/store/slices/themeSlice";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize theme on app load
    dispatch(initializeTheme());

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      dispatch(setSystemTheme(e.matches ? "dark" : "light"));
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [dispatch]);

  return <>{children}</>;
};
