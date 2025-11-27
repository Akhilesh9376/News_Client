import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { HomePage } from "./pages/public/HomePage";
import { ArticleDetail } from "./pages/public/ArticleDetail";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";
import CareersPage from "./pages/public/CareersPage";
import PrivacyPage from "./pages/public/PrivacyPage";
import TermsPage from "./pages/public/TermsPage";

import { EmployeeLogin } from "./pages/employee/EmployeeLogin";
import { EmployeeDashboard } from "./pages/employee/EmployeeDashboard";
import { WriteArticle } from "./pages/employee/WriteArticle";
import { EditArticle } from "./pages/employee/EditArticle";
import { MyArticles } from "./pages/employee/MyArticles";
import { EmployeeProfile } from "./pages/employee/EmployeeProfile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAppDispatch } from "@/hooks/redux";
import { loginStart, loginSuccess, logout as logoutAction } from "@/store/slices/authSlice";
import { jwtDecode } from "jwt-decode";
import ScrollToTop from "./components/scrollToTop/ScrollToTop";

const queryClient = new QueryClient();

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Bootstrap auth from stored token to persist login across refresh
    const token = localStorage.getItem("token");
    dispatch(loginStart());
    if (!token) {
      dispatch(logoutAction());
      return;
    }
    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp > now) {
        const emp = decoded.employee || decoded.user || {};
        dispatch(
          loginSuccess({
            id: emp.id,
            email: emp.email,
            name: emp.name,
            role: emp.role || "employee",
            createdAt: new Date((decoded.iat || now) * 1000).toISOString(),
          })
        );
      } else {
        localStorage.removeItem("token");
        dispatch(logoutAction());
      }
    } catch (e) {
      localStorage.removeItem("token");
      dispatch(logoutAction());
    }
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <Toaster />
          <Sonner position="top-right" />
          <BrowserRouter>
          <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/article/:id" element={<ArticleDetail />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />

             
              {/* Employee Routes */}

              <Route path="/employee/login" element={<EmployeeLogin />} />

            {/* <Route 
                path="/employee/dashboard" 
                element={<EmployeeDashboard />} 
            
            /> */}
            <Route
              path="/employee/dashboard"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/write-article"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <WriteArticle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/my-articles"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <MyArticles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/edit-article/:id"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <EditArticle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/profile"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeeProfile />
                </ProtectedRoute>
              }
            />
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
