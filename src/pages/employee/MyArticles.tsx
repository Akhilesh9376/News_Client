import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Newspaper,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { useAppSelector } from "@/hooks/redux";
import { useToast } from "@/hooks/use-toast";
import { Article } from "@/types";
import axiosInstance from "@/config/axiosInstance";
import { Atom } from "react-loading-indicators";

// Load employee articles from API instead of mock

export const MyArticles = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { categories } = useAppSelector((state) => state.news);
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Server-side authored articles with pagination + filters
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    getPageNumbers,
    hasNextPage,
    hasPreviousPage,
  } = usePagination({
    totalItems,
    itemsPerPage: 10,
  });

  useEffect(() => {
    const loadEmployeeArticles = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get("/news/mine", {
          params: {
            page: currentPage,
            limit: 10,
            search: searchTerm || undefined,
            category:
              categoryFilter === "all" || !categoryFilter
                ? undefined
                : categoryFilter,
          },
        });
        const apiArticles: Article[] = (res.data?.news || []).map((n: any) => ({
          id: n._id,
          title: n.heading || "",
          content: n.content || "",
          excerpt: n.subheading || "",
          imageUrl: n.imageUrl || "",
          category: n.category || "General",
          author: { id: "unknown", name: n.employeeName || "Unknown" },
          status: "approved",
          createdAt: n.publishedDate
            ? new Date(n.publishedDate).toISOString()
            : new Date().toISOString(),
          updatedAt: n.publishedDate
            ? new Date(n.publishedDate).toISOString()
            : new Date().toISOString(),
          publishedAt: n.publishedDate
            ? new Date(n.publishedDate).toISOString()
            : undefined,
          views: typeof n.views === "number" ? n.views : 0,
        }));
        setArticles(apiArticles);
        setTotalItems(res.data?.totalItems || apiArticles.length);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch my articles", error);
        toast({
          title: "Failed to load",
          description: "Could not fetch your articles from the server.",
          variant: "destructive",
        });
      }
    };
    loadEmployeeArticles();
  }, [currentPage, searchTerm, categoryFilter]);

  // Server returns already filtered and latest-first
  const filteredArticles = articles;

  const currentArticles = filteredArticles;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "draft":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this article?",
    );
    if (!confirmed) return;
    try {
      await axiosInstance.delete(`/news/${id}`);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      toast({
        title: "Deleted",
        description: "Your article has been removed.",
        variant: "success",
      });
    } catch (error) {
      console.error("Delete failed", error);
      toast({
        title: "Delete failed",
        description: "Could not delete the article. Try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/employee/dashboard"
              className="flex items-center space-x-2"
            >
              <div className="bg-brand-600 p-2 rounded-lg">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-brand-700">UP Uday News</h1>
                <p className="text-xs text-brand-500 -mt-1">Employee Portal</p>
              </div>
            </Link>

            <div className="flex items-center space-x-2">
              <Link to="/employee/profile">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Link to="/employee/write-article">
                <Button className="bg-brand-600 hover:bg-brand-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Write New Article
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Articles
            </h1>
            <p className="text-muted-foreground">
              Manage your published and draft articles
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
                    <p className="text-2xl font-bold">{articles.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-brand-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Published</p>
                    <p className="text-2xl font-bold text-green-600">
                      {articles.filter((a) => a.status === "approved").length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {articles.filter((a) => a.status === "pending").length}
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
                    <p className="text-sm text-muted-foreground">Drafts</p>
                    <p className="text-2xl font-bold text-gray-600">
                      {articles.filter((a) => a.status === "draft").length}
                    </p>
                  </div>
                  <Edit className="h-8 w-8 text-gray-600" />
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
                      placeholder="Search your articles..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        goToPage(1);
                      }}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={categoryFilter}
                  onValueChange={(val) => {
                    setCategoryFilter(val);
                    goToPage(1);
                  }}
                >
                  <SelectTrigger className="w-56">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Articles List */}
          <Card>
            <CardHeader>
              <CardTitle>Articles ({totalItems})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ?
                (
                  // Loading state
                  <main className="flex-1 flex items-center justify-center">
                    <Atom
                      color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
                      size="large"
                      text="Loading..."
                    />
                  </main>
                ) :
                currentArticles.length > 0 ? (
                  <div className="space-y-4">
                    {currentArticles.map((article) => (
                      <div
                        key={article.id}
                        className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2">
                              <Badge
                                className={getCategoryColor(article.category)}
                              >
                                {article.category}
                              </Badge>
                              <Badge className={getStatusColor(article.status)}>
                                <div className="flex items-center space-x-1">
                                  {getStatusIcon(article.status)}
                                  <span className="capitalize">
                                    {article.status}
                                  </span>
                                </div>
                              </Badge>
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
                              {article.status === "approved" && (
                                <a
                                  href={`/article/${article.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-2 text-xs text-brand-500 hover:text-brand-700"
                                >
                                  [View Live]
                                </a>
                              )}
                            </h3>
                            <p className="text-muted-foreground line-clamp-2">
                              {article.excerpt}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>
                                Created: {formatDate(article.createdAt)}
                              </span>
                              <span>
                                Updated: {formatDate(article.updatedAt)}
                              </span>
                              {article.publishedAt && (
                                <span>
                                  Published: {formatDate(article.publishedAt)}
                                </span>
                              )}
                              <span>
                                Readers: {article.views ?? 0}
                              </span>
                            </div>
                            {article.rejectionReason && (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                                <p className="text-sm text-red-800">
                                  <strong>Rejection Reason:</strong>{" "}
                                  {article.rejectionReason}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => {
                                setSelectedArticle(article);
                                setViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Link to={`/employee/edit-article/${article.id}`} state={{ article }}>
                              <Button
                                size="sm"
                                className="bg-amber-500 hover:bg-amber-600 text-white"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => handleDelete(article.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="font-semibold mb-2">No articles found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {searchTerm || statusFilter !== "all"
                        ? "No articles match your current filters."
                        : "You haven't written any articles yet."}
                    </p>

                    <Link to="/employee/write-article">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Write Your First Article
                      </Button>
                    </Link>
                  </div>
                )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={goToPreviousPage}
                          className={
                            !hasPreviousPage
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                      {getPageNumbers().map((pageNumber, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            isActive={pageNumber === currentPage}
                            onClick={() => goToPage(pageNumber)}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={goToNextPage}
                          className={
                            !hasNextPage
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>

          {/* View Article Dialog */}
          <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Article Details</DialogTitle>
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
                      <Badge className={getStatusColor(selectedArticle.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(selectedArticle.status)}
                          <span className="capitalize">
                            {selectedArticle.status}
                          </span>
                        </div>
                      </Badge>
                    </div>
                    <h1 className="text-2xl font-bold">
                      {selectedArticle.title}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      {selectedArticle.excerpt}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>
                        Created: {formatDate(selectedArticle.createdAt)}
                      </span>
                      <span>
                        Updated: {formatDate(selectedArticle.updatedAt)}
                      </span>
                      {selectedArticle.publishedAt && (
                        <span>
                          Published: {formatDate(selectedArticle.publishedAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {selectedArticle.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2">
                        Rejection Feedback
                      </h4>
                      <p className="text-sm text-red-700">
                        {selectedArticle.rejectionReason}
                      </p>
                    </div>
                  )}

                  <div className="prose max-w-none">
                    <div
                      className="text-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: selectedArticle.content,
                      }}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    {(selectedArticle.status === "draft" ||
                      selectedArticle.status === "rejected") && (
                        <Link to={`/employee/edit-article/${selectedArticle.id}`} state={{ article: selectedArticle }}>
                          <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Article
                          </Button>
                        </Link>
                      )}
                    <Button
                      variant="outline"
                      onClick={() => setViewDialogOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};
