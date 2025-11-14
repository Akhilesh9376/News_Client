import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  UserPlus,
  UserMinus,
  Clock,
  BarChart3,
  LogOut,
  Newspaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAppDispatch } from "@/hooks/redux";
import { logout } from "@/store/slices/authSlice";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/config/axiosInstance";
import { useNavigate } from "react-router-dom";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (e) {}
    localStorage.removeItem("token");
    dispatch(logout());
    toast({
      title: "Logged Out Successfully 👋",
  description: "You have been securely logged out of UP Uday News.",
      variant: "success",
    });
    onClose();
    navigate("/employee/login", { replace: true });
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/admin/dashboard",
    },
    {
      icon: Clock,
      label: "Pending Approvals",
      href: "/admin/pending",
    },
    {
      icon: FileText,
      label: "All Articles",
      href: "/admin/articles",
    },
    {
      icon: UserPlus,
      label: "Add Employee",
      href: "/admin/add-employee",
    },
    {
      icon: Users,
      label: "Manage Employees",
      href: "/admin/employees",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      href: "/admin/analytics",
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 bg-brand-950 dark:bg-brand-950 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-brand-800">
            <Link to="/admin/dashboard" className="flex items-center space-x-2">
              <div className="bg-brand-600 p-2 rounded-lg">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
              <div>
        <h1 className="text-xl font-bold">UP Uday News</h1>
                <p className="text-xs text-brand-300 -mt-1">Admin Panel</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={onClose}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? "bg-brand-600 text-white"
                          : "text-brand-300 hover:bg-brand-800 hover:text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-brand-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-300">Theme</span>
              <ThemeToggle variant="ghost" />
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-brand-300 hover:bg-brand-800 hover:text-white"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
