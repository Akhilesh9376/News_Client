import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  FolderOpen,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { logout } from "@/store/slices/authSlice";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/config/axiosInstance";

export const EmployeeNavigation = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Attempt server-side logout to invalidate token (best-effort)
      await axiosInstance.post("/auth/v1/logout");
    } catch (e) {
      // Ignore network errors; proceed with local logout
    }
    // Clear local token to prevent auto re-login on refresh
    localStorage.removeItem("token");
    localStorage.removeItem("persist:root");
    dispatch(logout());
    toast({
      title: "Logged Out Successfully 👋",
  description: "You have been securely logged out of UP Uday News.",
      variant: "success",
    });
    navigate("/employee/login", { replace: true });
    window.location.replace("/employee/login")
  };

  const navItems = [
    {
      href: "/employee/dashboard",
      icon: Home,
      label: "Dashboard",
    },
    {
      href: "/employee/write-article",
      icon: FileText,
      label: "Write Article",
    },
    {
      href: "/employee/my-articles",
      icon: FolderOpen,
      label: "My Articles",
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="flex items-center space-x-4">
      {/* Navigation Links - Hidden on mobile */}
      <nav className="hidden md:flex items-center space-x-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} to={item.href}>
              <Button
                variant={isActive(item.href) ? "default" : "ghost"}
                size="sm"
                className={
                  isActive(item.href) ? "bg-brand-600 hover:bg-brand-700" : ""
                }
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle - Desktop */}
      <div className="hidden md:block">
        <ThemeToggle />
      </div>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <div className="w-6 h-6 bg-brand-100 dark:bg-brand-800 rounded-full flex items-center justify-center">
              <User className="h-3 w-3 text-brand-600 dark:text-brand-400" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium">{user?.name}</p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <DropdownMenuSeparator />

          {/* Mobile Navigation */}
          <div className="md:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} to={item.href}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </DropdownMenuItem>
                </Link>
              );
            })}
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Theme</span>
                <ThemeToggle size="sm" />
              </div>
            </div>
            <DropdownMenuSeparator />
          </div>

          <Link to="/employee/profile">
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="h-4 w-4 mr-2" />
              Profile Settings
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-red-600"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
