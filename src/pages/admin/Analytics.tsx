import { useState, useEffect } from "react";
import {
  Menu,
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  FileText,
  Calendar,
  Award,
  Target,
} from "lucide-react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface AnalyticsData {
  overview: {
    totalViews: number;
    totalArticles: number;
    activeEmployees: number;
    avgReadTime: string;
    monthlyGrowth: number;
    engagementRate: number;
  };
  categoryPerformance: {
    category: string;
    articles: number;
    views: number;
    engagement: number;
    growth: number;
  }[];
  employeeStats: {
    id: string;
    name: string;
    articles: number;
    avgViews: number;
    approvalRate: number;
    engagement: number;
    lastActive: string;
  }[];
  timelineData: {
    date: string;
    articles: number;
    views: number;
    engagement: number;
  }[];
  topArticles: {
    id: string;
    title: string;
    author: string;
    category: string;
    views: number;
    engagement: number;
    publishedAt: string;
  }[];
}

const mockAnalyticsData: AnalyticsData = {
  overview: {
    totalViews: 2456789,
    totalArticles: 1247,
    activeEmployees: 23,
    avgReadTime: "3m 45s",
    monthlyGrowth: 18.5,
    engagementRate: 67.8,
  },
  categoryPerformance: [
    {
      category: "Technology",
      articles: 189,
      views: 567890,
      engagement: 72.3,
      growth: 23.1,
    },
    {
      category: "Sports",
      articles: 156,
      views: 445623,
      engagement: 68.9,
      growth: 15.7,
    },
    {
      category: "Politics",
      articles: 134,
      views: 389456,
      engagement: 64.2,
      growth: 12.3,
    },
    {
      category: "Business",
      articles: 167,
      views: 378912,
      engagement: 61.8,
      growth: 19.4,
    },
    {
      category: "Health",
      articles: 98,
      views: 234567,
      engagement: 75.1,
      growth: 28.6,
    },
    {
      category: "Entertainment",
      articles: 123,
      views: 298734,
      engagement: 59.3,
      growth: 8.9,
    },
  ],
  employeeStats: [
    {
      id: "emp-1",
      name: "John Smith",
      articles: 45,
      avgViews: 12560,
      approvalRate: 94.2,
      engagement: 73.5,
      lastActive: "2024-01-15T14:30:00Z",
    },
    {
      id: "emp-2",
      name: "Jane Doe",
      articles: 38,
      avgViews: 11890,
      approvalRate: 91.8,
      engagement: 71.2,
      lastActive: "2024-01-15T10:15:00Z",
    },
    {
      id: "emp-3",
      name: "Mike Johnson",
      articles: 29,
      avgViews: 9845,
      approvalRate: 85.7,
      engagement: 65.8,
      lastActive: "2024-01-14T16:45:00Z",
    },
    {
      id: "emp-4",
      name: "Sarah Williams",
      articles: 33,
      avgViews: 10234,
      approvalRate: 88.9,
      engagement: 68.4,
      lastActive: "2024-01-15T09:20:00Z",
    },
  ],
  timelineData: [
    { date: "2024-01-01", articles: 23, views: 45678, engagement: 65.2 },
    { date: "2024-01-02", articles: 19, views: 42134, engagement: 67.1 },
    { date: "2024-01-03", articles: 25, views: 48923, engagement: 69.8 },
    { date: "2024-01-04", articles: 21, views: 44567, engagement: 64.3 },
    { date: "2024-01-05", articles: 27, views: 52341, engagement: 71.2 },
  ],
  topArticles: [
    {
      id: "article-1",
      title: "Revolutionary AI Breakthrough in Healthcare",
      author: "John Smith",
      category: "Technology",
      views: 45678,
      engagement: 89.3,
      publishedAt: "2024-01-10T00:00:00Z",
    },
    {
      id: "article-2",
      title: "Championship Victory Sparks City Celebration",
      author: "Jane Doe",
      category: "Sports",
      views: 42134,
      engagement: 85.7,
      publishedAt: "2024-01-12T00:00:00Z",
    },
    {
      id: "article-3",
      title: "Economic Policy Changes Impact Markets",
      author: "Mike Johnson",
      category: "Business",
      views: 38956,
      engagement: 78.9,
      publishedAt: "2024-01-09T00:00:00Z",
    },
    {
      id: "article-4",
      title: "Mental Health Awareness Campaign Launch",
      author: "Sarah Williams",
      category: "Health",
      views: 36742,
      engagement: 82.1,
      publishedAt: "2024-01-11T00:00:00Z",
    },
    {
      id: "article-5",
      title: "Climate Change Summit Reaches Agreement",
      author: "John Smith",
      category: "Politics",
      views: 34567,
      engagement: 76.4,
      publishedAt: "2024-01-08T00:00:00Z",
    },
  ],
};

export const Analytics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState("30d");
  const [data, setData] = useState<AnalyticsData>(mockAnalyticsData);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getPerformanceColor = (value: number) => {
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

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
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-6 w-6 text-brand-600" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Analytics Dashboard
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive insights and performance metrics
                  </p>
                </div>
              </div>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        <main className="p-6 space-y-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <p className="text-2xl font-bold">
                      {formatNumber(data.overview.totalViews)}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      {getGrowthIcon(data.overview.monthlyGrowth)}
                      <span className="text-sm text-green-600">
                        +{data.overview.monthlyGrowth}%
                      </span>
                    </div>
                  </div>
                  <Eye className="h-8 w-8 text-brand-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Articles
                    </p>
                    <p className="text-2xl font-bold">
                      {data.overview.totalArticles}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {data.overview.activeEmployees} active writers
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Avg Read Time
                    </p>
                    <p className="text-2xl font-bold">
                      {data.overview.avgReadTime}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Industry avg: 2m 30s
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Engagement Rate
                    </p>
                    <p className="text-2xl font-bold">
                      {data.overview.engagementRate}%
                    </p>
                    <Progress
                      value={data.overview.engagementRate}
                      className="mt-2"
                    />
                  </div>
                  <Target className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Category Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Articles</TableHead>
                    <TableHead>Total Views</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.categoryPerformance.map((category) => (
                    <TableRow key={category.category}>
                      <TableCell className="font-medium">
                        {category.category}
                      </TableCell>
                      <TableCell>{category.articles}</TableCell>
                      <TableCell>{formatNumber(category.views)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span
                            className={getPerformanceColor(category.engagement)}
                          >
                            {category.engagement}%
                          </span>
                          <Progress
                            value={category.engagement}
                            className="w-16"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {getGrowthIcon(category.growth)}
                          <span
                            className={
                              category.growth > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {category.growth > 0 ? "+" : ""}
                            {category.growth}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Employee Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Top Performing Employees</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.employeeStats.map((employee, index) => (
                    <div
                      key={employee.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-brand-600 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {employee.articles} articles
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {formatNumber(employee.avgViews)} avg views
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {employee.approvalRate}% approval rate
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Articles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Top Performing Articles</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topArticles.map((article, index) => (
                    <div
                      key={article.id}
                      className="flex items-start justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="bg-green-600 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium line-clamp-2">
                            {article.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            by {article.author} • {article.category}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(article.publishedAt)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {formatNumber(article.views)} views
                        </div>
                        <div className="text-sm text-green-600">
                          {article.engagement}% engagement
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Article Approval Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>This Month</span>
                    <span className="font-bold">92.3%</span>
                  </div>
                  <Progress value={92.3} />
                  <div className="text-sm text-muted-foreground">
                    +3.2% from last month
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Average Review Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Current Average</span>
                    <span className="font-bold">2.4 hours</span>
                  </div>
                  <Progress value={75} />
                  <div className="text-sm text-muted-foreground">
                    Target: 2 hours or less
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Quality Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Overall Score</span>
                    <span className="font-bold">8.7/10</span>
                  </div>
                  <Progress value={87} />
                  <div className="text-sm text-muted-foreground">
                    Based on reader feedback
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
