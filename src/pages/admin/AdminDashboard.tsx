import { useState, useEffect } from "react";
import { Menu, Plus, Eye, Users, Clock, TrendingUp } from "lucide-react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { setStatistics, setPendingArticles } from "@/store/slices/adminSlice";
import { Article } from "@/types";

// Mock data for demonstration
const mockPendingArticles: Article[] = [
  {
    id: "pending-1",
    title: "Revolutionary Green Energy Solution Promises Zero Emissions",
    content: "Lorem ipsum dolor sit amet...",
    excerpt:
      "Scientists develop breakthrough technology that could eliminate carbon emissions from industrial processes.",
    category: "Technology",
    author: { id: "emp-1", name: "John Smith" },
    status: "pending",
    createdAt: "2024-01-15T14:30:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "pending-2",
    title: "Local Sports Team Reaches Championship Finals",
    content: "Lorem ipsum dolor sit amet...",
    excerpt:
      "After a remarkable season, the hometown heroes secure their place in the championship game.",
    category: "Sports",
    author: { id: "emp-2", name: "Jane Doe" },
    status: "pending",
    createdAt: "2024-01-15T13:15:00Z",
    updatedAt: "2024-01-15T13:15:00Z",
  },
  {
    id: "pending-3",
    title: "Economic Forecast Shows Promising Growth Trends",
    content: "Lorem ipsum dolor sit amet...",
    excerpt:
      "Leading economists predict sustained growth across multiple sectors for the coming quarter.",
    category: "Business",
    author: { id: "emp-3", name: "Mike Johnson" },
    status: "pending",
    createdAt: "2024-01-15T12:00:00Z",
    updatedAt: "2024-01-15T12:00:00Z",
  },
];

export const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { statistics, pendingArticles, isLoading } = useAppSelector(
    (state) => state.admin,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Mock loading data
    dispatch(
      setStatistics({
        totalArticles: 156,
        totalEmployees: 12,
        pendingApprovals: mockPendingArticles.length,
        publishedToday: 8,
      }),
    );
    dispatch(setPendingArticles(mockPendingArticles));
  }, [dispatch]);

  const handleApproveArticle = (articleId: string) => {
    // This would normally make an API call
    console.log("Approving article:", articleId);
    // For now, just remove from pending list
    dispatch(
      setPendingArticles(
        pendingArticles.filter((article) => article.id !== articleId),
      ),
    );
  };

  const handleRejectArticle = (articleId: string) => {
    // This would normally make an API call
    console.log("Rejecting article:", articleId);
    // For now, just remove from pending list
    dispatch(
      setPendingArticles(
        pendingArticles.filter((article) => article.id !== articleId),
      ),
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-background shadow-sm border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back! Here's what's happening today.
                </p>
              </div>
            </div>
            <Button className="bg-brand-600 hover:bg-brand-700">
              <Plus className="h-4 w-4 mr-2" />
              Quick Actions
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Articles
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statistics.totalArticles}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Employees
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statistics.totalEmployees}
                </div>
                <p className="text-xs text-muted-foreground">
                  +2 new this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Approvals
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {statistics.pendingApprovals}
                </div>
                <p className="text-xs text-muted-foreground">
                  Requires your attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Published Today
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {statistics.publishedToday}
                </div>
                <p className="text-xs text-muted-foreground">
                  +20% from yesterday
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Pending Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Pending Article Approvals</span>
                {pendingArticles.length > 0 && (
                  <Badge variant="secondary">{pendingArticles.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingArticles.length > 0 ? (
                <div className="space-y-4">
                  {pendingArticles.map((article) => (
                    <div
                      key={article.id}
                      className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {article.category}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              by {article.author.name}
                            </span>
                          </div>
                          <h3 className="font-semibold text-foreground mb-2">
                            {article.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {article.excerpt}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            size="sm"
                            onClick={() => handleApproveArticle(article.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectArticle(article.id)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-semibold mb-2">No pending articles</h3>
                  <p className="text-sm">
                    All articles have been reviewed. Great job!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-brand-100 p-3 rounded-lg">
                    <Plus className="h-6 w-6 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Add New Employee</h3>
                    <p className="text-sm text-muted-foreground">
                      Create a new contributor account
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Eye className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">View All Articles</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage published content
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      View detailed insights
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};
