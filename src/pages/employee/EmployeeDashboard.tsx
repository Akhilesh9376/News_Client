import { Link } from "react-router-dom";
import {
  Newspaper,
  ArrowLeft,
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { logout } from "@/store/slices/authSlice";
import { useToast } from "@/hooks/use-toast";

export const EmployeeDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: "Logged Out Successfully 👋",
  description: "You have been securely logged out of UP Uday News.",
      variant: "success",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-brand-600 p-2 rounded-lg">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
              <div>
  <h1 className="text-xl font-bold text-brand-700">UP Uday News</h1>
                <p className="text-xs text-brand-500 -mt-1">Employee Portal</p>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Link to="/employee/profile">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-muted-foreground">
  Ready to create amazing content for UP Uday News? Here's your
              dashboard.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Articles
                    </p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <FileText className="h-8 w-8 text-brand-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-orange-600">3</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Approved</p>
                    <p className="text-2xl font-bold text-green-600">8</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">1</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link to="/employee/write-article">
                  <Button className="h-20 w-full flex-col space-y-2 bg-brand-600 hover:bg-brand-700">
                    <FileText className="h-6 w-6" />
                    <span>Write New Article</span>
                  </Button>
                </Link>
                <Link to="/employee/my-articles?status=pending">
                  <Button
                    variant="outline"
                    className="h-20 w-full flex-col space-y-2"
                  >
                    <Clock className="h-6 w-6" />
                    <span>View Pending Articles</span>
                  </Button>
                </Link>
                <Link to="/employee/my-articles?status=approved">
                  <Button
                    variant="outline"
                    className="h-20 w-full flex-col space-y-2"
                  >
                    <CheckCircle className="h-6 w-6" />
                    <span>View Published Articles</span>
                  </Button>
                </Link>
                <Link to="/employee/profile">
                  <Button
                    variant="outline"
                    className="h-20 w-full flex-col space-y-2"
                  >
                    <Settings className="h-6 w-6" />
                    <span>Profile Settings</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Articles */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock articles */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">
                      Revolutionary Green Energy Solution
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Technology • 2 days ago
                    </p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">
                    Pending
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">
                      Local Sports Team Championship Win
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Sports • 5 days ago
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Approved
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">Economic Forecast Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Business • 1 week ago
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Approved
                  </Badge>
                </div>
              </div>

              <div className="text-center mt-6 p-6 bg-brand-50 rounded-lg">
                <h3 className="font-semibold mb-2">
                  Ready to contribute more?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start writing compelling stories and manage your content with
                  our full-featured portal.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Link to="/employee/write-article">
                    <Button
                      size="sm"
                      className="bg-brand-600 hover:bg-brand-700"
                    >
                      Write New Article
                    </Button>
                  </Link>
                  <Link to="/employee/my-articles">
                    <Button variant="outline" size="sm">
                      Manage My Articles
                    </Button>
                  </Link>
                  <Link to="/employee/profile">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Profile Settings
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
