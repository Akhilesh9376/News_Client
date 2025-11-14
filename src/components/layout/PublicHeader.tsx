import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { setFilters } from "@/store/slices/newsSlice";

export const PublicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { categories, filters } = useAppSelector((state) => state.news);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));
  };

  return (
    <header className="bg-background shadow-sm border-b border-border sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-brand-600 p-2 rounded-lg">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <div>
        <h1 className="text-xl font-bold text-brand-700">UP Uday News</h1>
              <p className="text-xs text-brand-500 -mt-1">360°</p>
            </div>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {/* <Link
              to="/admin/login"
              className="text-sm text-muted-foreground hover:text-brand-600 transition-colors"
            >
              Admin
            </Link> */}
            {isAuthenticated && user?.role === "employee" ? (
              <Link
                to="/employee/dashboard"
                className="text-sm text-muted-foreground hover:text-brand-600 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/employee/login"
                className="text-sm text-muted-foreground hover:text-brand-600 transition-colors"
              >
                Employee Login
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Categories bar */}
        <div className="hidden md:flex items-center space-x-6 py-3 border-t border-border">
          <button
            onClick={() => dispatch(setFilters({ category: "" }))}
            className={`text-sm font-medium transition-colors ${
              filters.category === ""
                ? "text-brand-600 border-b-2 border-brand-600"
                : "text-muted-foreground hover:text-brand-600"
            }`}
          >
            All News
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => dispatch(setFilters({ category: category.slug }))}
              className={`text-sm font-medium transition-colors ${
                filters.category === category.slug
                  ? "text-brand-600 border-b-2 border-brand-600"
                  : "text-muted-foreground hover:text-brand-600"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Mobile categories */}
            <div className="px-4 pb-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Categories
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    dispatch(setFilters({ category: "" }));
                    setIsMenuOpen(false);
                  }}
                  className={`text-left p-2 rounded-lg text-sm transition-colors ${
                    filters.category === ""
                      ? "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  All News
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      dispatch(setFilters({ category: category.slug }));
                      setIsMenuOpen(false);
                    }}
                    className={`text-left p-2 rounded-lg text-sm transition-colors ${
                      filters.category === category.slug
                        ? "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300"
                        : "text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile navigation */}
            <div className="px-4 pb-4 space-y-2">
              <div className="flex items-center justify-between p-2">
                <span className="text-sm font-medium text-foreground">
                  Theme
                </span>
                <ThemeToggle />
              </div>
              {/* <Link
                to="/admin/login"
                className="block p-2 text-sm text-muted-foreground hover:text-brand-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Login
              </Link> */}
              {isAuthenticated && user?.role === "employee" ? (
                <Link
                  to="/employee/dashboard"
                  className="block p-2 text-sm text-muted-foreground hover:text-brand-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/employee/login"
                  className="block p-2 text-sm text-muted-foreground hover:text-brand-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Employee Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
