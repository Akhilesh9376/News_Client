import { useState, useEffect } from "react";
import {
  Menu,
  Clock,
  Search,
  Filter,
  Check,
  X,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import {
  setPendingArticles,
  approveArticle,
  rejectArticle,
} from "@/store/slices/adminSlice";
import { useToast } from "@/hooks/use-toast";
import { Article } from "@/types";

const mockPendingArticles: Article[] = [
  {
    id: "pending-1",
    title: "Revolutionary AI Breakthrough Changes Healthcare Industry",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
    excerpt:
      "New AI technology promises to revolutionize patient care and medical diagnosis with unprecedented accuracy.",
    category: "Technology",
    author: { id: "emp-1", name: "John Smith" },
    status: "pending",
    createdAt: "2024-01-15T14:30:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "pending-2",
    title: "Local Basketball Team Wins State Championship",
    content:
      "In a thrilling final game, the hometown heroes secured their first state championship in over a decade...",
    excerpt:
      "After years of dedication and hard work, the local basketball team finally claims the state title.",
    category: "Sports",
    author: { id: "emp-2", name: "Jane Doe" },
    status: "pending",
    createdAt: "2024-01-15T13:15:00Z",
    updatedAt: "2024-01-15T13:15:00Z",
  },
  {
    id: "pending-3",
    title: "Economic Forecast Shows Promising Trends for Next Quarter",
    content:
      "Leading economists are optimistic about the upcoming quarter, citing several positive indicators...",
    excerpt:
      "Market analysts predict sustained growth across multiple sectors based on recent economic data.",
    category: "Business",
    author: { id: "emp-3", name: "Mike Johnson" },
    status: "pending",
    createdAt: "2024-01-15T12:00:00Z",
    updatedAt: "2024-01-15T12:00:00Z",
  },
  {
    id: "pending-4",
    title: "New Environmental Protection Act Passes Senate Vote",
    content:
      "The landmark environmental legislation received bipartisan support in yesterday's senate session...",
    excerpt:
      "Historic environmental protection measures gain political momentum with broad legislative support.",
    category: "Politics",
    author: { id: "emp-4", name: "Sarah Williams" },
    status: "pending",
    createdAt: "2024-01-15T11:45:00Z",
    updatedAt: "2024-01-15T11:45:00Z",
  },
  {
    id: "pending-5",
    title: "Mental Health Awareness Campaign Launches Nationwide",
    content:
      "A comprehensive mental health initiative aims to reduce stigma and improve access to care...",
    excerpt:
      "New nationwide campaign focuses on mental health education and support services accessibility.",
    category: "Health",
    author: { id: "emp-1", name: "John Smith" },
    status: "pending",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
];

export const PendingApprovals = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [feedback, setFeedback] = useState("");

  const dispatch = useAppDispatch();
  const { toast } = useToast();

  useEffect(() => {
    setArticles(mockPendingArticles);
    dispatch(setPendingArticles(mockPendingArticles));
  }, [dispatch]);

  const handleSelectArticle = (articleId: string, checked: boolean) => {
    if (checked) {
      setSelectedArticles((prev) => [...prev, articleId]);
    } else {
      setSelectedArticles((prev) => prev.filter((id) => id !== articleId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedArticles(filteredArticles.map((article) => article.id));
    } else {
      setSelectedArticles([]);
    }
  };

  const handleSingleAction = (
    article: Article,
    action: "approve" | "reject",
  ) => {
    setSelectedArticle(article);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleBulkAction = (action: "approve" | "reject") => {
    if (selectedArticles.length === 0) return;
    setActionType(action);
    setActionDialogOpen(true);
  };

  const executeAction = () => {
    const articlesToProcess = selectedArticle
      ? [selectedArticle.id]
      : selectedArticles;

    const articleCount = articlesToProcess.length;
    const articleText = articleCount === 1 ? "article" : "articles";

    if (actionType === "approve") {
      articlesToProcess.forEach((id) => {
        setArticles((prev) => prev.filter((article) => article.id !== id));
        dispatch(approveArticle(id));
      });

      toast({
        title: `Article${articleCount > 1 ? "s" : ""} Approved! ✅`,
        description: `${articleCount} ${articleText} ${articleCount === 1 ? "has" : "have"} been approved and published.`,
        variant: "success",
      });
    } else {
      articlesToProcess.forEach((id) => {
        setArticles((prev) => prev.filter((article) => article.id !== id));
        dispatch(rejectArticle({ id, reason: feedback }));
      });

      toast({
        title: `Article${articleCount > 1 ? "s" : ""} Rejected ❌`,
        description: `${articleCount} ${articleText} ${articleCount === 1 ? "has" : "have"} been rejected with feedback.`,
        variant: "destructive",
      });
    }

    setSelectedArticles([]);
    setSelectedArticle(null);
    setActionDialogOpen(false);
    setFeedback("");
  };

  const filteredArticles = articles
    .filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" ||
        article.category.toLowerCase() === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "author":
          return a.author.name.localeCompare(b.author.name);
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      technology: "bg-blue-100 text-blue-800",
      sports: "bg-green-100 text-green-800",
      politics: "bg-red-100 text-red-800",
      business: "bg-yellow-100 text-yellow-800",
      entertainment: "bg-purple-100 text-purple-800",
      health: "bg-pink-100 text-pink-800",
    };
    return (
      colors[category.toLowerCase() as keyof typeof colors] ||
      "bg-gray-100 text-gray-800"
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
                <Clock className="h-6 w-6 text-brand-600" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Pending Approvals
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Review and approve submitted articles
                  </p>
                </div>
              </div>
            </div>
            {selectedArticles.length > 0 && (
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handleBulkAction("approve")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve ({selectedArticles.length})
                </Button>
                <Button
                  onClick={() => handleBulkAction("reject")}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject ({selectedArticles.length})
                </Button>
              </div>
            )}
          </div>
        </header>

        <main className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Pending
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {articles.length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Today's Submissions
                    </p>
                    <p className="text-2xl font-bold">
                      {
                        articles.filter(
                          (a) =>
                            new Date(a.createdAt).toDateString() ===
                            new Date().toDateString(),
                        ).length
                      }
                    </p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-brand-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Selected</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedArticles.length}
                    </p>
                  </div>
                  <Check className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Avg Review Time
                    </p>
                    <p className="text-2xl font-bold">2.5h</p>
                  </div>
                  <Filter className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search articles or authors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="politics">Politics</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="author">Author A-Z</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Articles List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={
                        selectedArticles.length === filteredArticles.length &&
                        filteredArticles.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                    <span>Pending Articles ({filteredArticles.length})</span>
                  </div>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className={`border rounded-lg p-4 transition-colors ${
                      selectedArticles.includes(article.id)
                        ? "bg-brand-50 border-brand-200"
                        : "hover:bg-accent/50"
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <Checkbox
                        checked={selectedArticles.includes(article.id)}
                        onCheckedChange={(checked) =>
                          handleSelectArticle(article.id, checked as boolean)
                        }
                      />

                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2">
                              <Badge
                                className={getCategoryColor(article.category)}
                              >
                                {article.category}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                by {article.author.name}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                • {formatDate(article.createdAt)}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                              <span
                                className="hover:text-brand-600 cursor-pointer"
                                onClick={() => {
                                  setSelectedArticle(article);
                                  setViewDialogOpen(true);
                                }}
                              >
                                {article.title}
                              </span>
                              <a
                                href={`/article/${article.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-xs text-brand-500 hover:text-brand-700"
                              >
                                [Preview]
                              </a>
                            </h3>
                            <p className="text-muted-foreground line-clamp-2">
                              {article.excerpt}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedArticle(article);
                              setViewDialogOpen(true);
                            }}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            View Full Article
                          </Button>

                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleSingleAction(article, "approve")
                              }
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleSingleAction(article, "reject")
                              }
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredArticles.length === 0 && (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="font-semibold mb-2">No pending articles</h3>
                    <p className="text-sm text-muted-foreground">
                      {searchTerm || categoryFilter !== "all"
                        ? "No articles match your current filters."
                        : "All articles have been reviewed. Great job!"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* View Article Dialog */}
          <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Article Preview</DialogTitle>
              </DialogHeader>
              {selectedArticle && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={getCategoryColor(selectedArticle.category)}
                      >
                        {selectedArticle.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        by {selectedArticle.author.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        • {formatDate(selectedArticle.createdAt)}
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold">
                      {selectedArticle.title}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      {selectedArticle.excerpt}
                    </p>
                  </div>

                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">
                      {selectedArticle.content}
                    </p>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => {
                        setViewDialogOpen(false);
                        handleSingleAction(selectedArticle, "reject");
                      }}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject Article
                    </Button>
                    <Button
                      onClick={() => {
                        setViewDialogOpen(false);
                        handleSingleAction(selectedArticle, "approve");
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve Article
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Action Confirmation Dialog */}
          <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {actionType === "approve" ? "Approve" : "Reject"} Article
                  {selectedArticles.length > 1 ? "s" : ""}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {actionType === "approve"
                    ? `Are you sure you want to approve ${selectedArticle ? "this article" : `${selectedArticles.length} articles`}? ${selectedArticle ? "It" : "They"} will be published immediately.`
                    : `Are you sure you want to reject ${selectedArticle ? "this article" : `${selectedArticles.length} articles`}?`}
                </p>

                {actionType === "reject" && (
                  <div className="space-y-2">
                    <Label htmlFor="feedback">
                      Reason for rejection (optional)
                    </Label>
                    <Textarea
                      id="feedback"
                      placeholder="Provide feedback to help the author improve..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setActionDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={executeAction}
                    className={
                      actionType === "approve"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }
                  >
                    {actionType === "approve" ? "Approve" : "Reject"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};
