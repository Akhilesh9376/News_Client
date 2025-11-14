import { useState, useEffect } from "react";
import {
  Menu,
  FileText,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { setArticles, deleteArticle } from "@/store/slices/newsSlice";
import { useToast } from "@/hooks/use-toast";
import { usePagination } from "@/hooks/use-pagination";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Article } from "@/types";

const mockAllArticles: Article[] = [
  {
    id: "article-1",
    title: "Breaking: Major Technology Conference Announces AI Breakthroughs",
    content:
      "Industry leaders gathered at the annual TechForward conference to reveal groundbreaking developments in artificial intelligence. The announcements include new machine learning algorithms that promise to revolutionize healthcare, autonomous vehicles, and natural language processing. Dr. Sarah Chen, lead researcher at AI Innovations Lab, presented findings that show a 40% improvement in diagnostic accuracy when AI assists radiologists in detecting early-stage cancers...",
    excerpt:
      "Industry leaders reveal groundbreaking developments in artificial intelligence that could reshape how we work and live.",
    imageUrl: "",
    category: "Technology",
    author: { id: "emp-1", name: "John Smith" },
    status: "approved",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    publishedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "article-2",
    title: "Global Markets Show Strong Recovery After Economic Reforms",
    content:
      "Financial analysts report positive trends across major stock exchanges following recent policy changes implemented by central banks worldwide...",
    excerpt:
      "Financial analysts report positive trends across major stock exchanges following recent policy changes.",
    category: "Business",
    author: { id: "emp-2", name: "Jane Doe" },
    status: "approved",
    createdAt: "2024-01-14T09:30:00Z",
    updatedAt: "2024-01-14T09:30:00Z",
    publishedAt: "2024-01-14T09:30:00Z",
  },
  {
    id: "article-3",
    title: "Championship Finals Draw Record-Breaking Viewership",
    content:
      "Sports fans worldwide tuned in for the most-watched championship game in tournament history, with over 1.2 billion viewers...",
    excerpt:
      "Sports fans worldwide tune in for the most-watched championship game in tournament history.",
    category: "Sports",
    author: { id: "emp-3", name: "Mike Johnson" },
    status: "approved",
    createdAt: "2024-01-13T08:45:00Z",
    updatedAt: "2024-01-13T08:45:00Z",
    publishedAt: "2024-01-13T08:45:00Z",
  },
  {
    id: "article-4",
    title: "Local Community Garden Project Transforms Neighborhood",
    content:
      "What started as a small initiative by residents has grown into a thriving community garden that provides fresh produce to 200 families...",
    excerpt:
      "Community-led initiative brings neighbors together while providing fresh, healthy food options.",
    category: "Health",
    author: { id: "emp-4", name: "Sarah Williams" },
    status: "approved",
    createdAt: "2024-01-12T07:15:00Z",
    updatedAt: "2024-01-12T07:15:00Z",
    publishedAt: "2024-01-12T07:15:00Z",
  },
  {
    id: "article-5",
    title: "New Climate Policy Faces Mixed Reception in Parliament",
    content:
      "The proposed climate legislation has sparked intense debate among lawmakers, with supporters praising its ambitious targets...",
    excerpt:
      "Lawmakers debate ambitious climate targets as environmental groups call for stronger action.",
    category: "Politics",
    author: { id: "emp-1", name: "John Smith" },
    status: "approved",
    createdAt: "2024-01-11T16:20:00Z",
    updatedAt: "2024-01-11T16:20:00Z",
    publishedAt: "2024-01-11T16:20:00Z",
  },
];

export const AllArticles = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [articles, setArticlesLocal] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
  });

  const dispatch = useAppDispatch();
  const { toast } = useToast();

  useEffect(() => {
    setArticlesLocal(mockAllArticles);
    dispatch(setArticles(mockAllArticles));
  }, [dispatch]);

  const handleDeleteArticle = (articleId: string) => {
    const article = articles.find((a) => a.id === articleId);

    if (
      confirm(
        "Are you sure you want to delete this article? This action cannot be undone.",
      )
    ) {
      setArticlesLocal((prev) =>
        prev.filter((article) => article.id !== articleId),
      );
      dispatch(deleteArticle(articleId));

      toast({
        title: "Article Deleted ❌",
        description: `"${article?.title}" has been permanently removed.`,
        variant: "destructive",
      });
    }
  };

  const handleEditArticle = (article: Article) => {
    setSelectedArticle(article);
    setEditForm({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedArticle) return;

    const updatedArticle = {
      ...selectedArticle,
      ...editForm,
      updatedAt: new Date().toISOString(),
    };

    setArticlesLocal((prev) =>
      prev.map((article) =>
        article.id === selectedArticle.id ? updatedArticle : article,
      ),
    );

    toast({
      title: "Article Updated! ✅",
      description: `"${editForm.title}" has been successfully updated.`,
      variant: "success",
    });

    setEditDialogOpen(false);
    setSelectedArticle(null);
  };

  const filteredArticles = articles
    .filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" ||
        article.category.toLowerCase() === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || article.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.publishedAt || b.createdAt).getTime() -
            new Date(a.publishedAt || a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.publishedAt || a.createdAt).getTime() -
            new Date(b.publishedAt || b.createdAt).getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.name.localeCompare(b.author.name);
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  // Pagination
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
    totalItems: filteredArticles.length,
    itemsPerPage: 10,
  });

  const currentArticles = filteredArticles.slice(
    paginatedData.startIndex,
    paginatedData.endIndex,
  );

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
                <FileText className="h-6 w-6 text-brand-600" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    All Articles
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Manage all published and unpublished articles
                  </p>
                </div>
              </div>
            </div>
            <Button className="bg-brand-600 hover:bg-brand-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Article
            </Button>
          </div>
        </header>

        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {
                        articles.filter(
                          (a) =>
                            new Date(a.createdAt).getMonth() ===
                            new Date().getMonth(),
                        ).length
                      }
                    </p>
                  </div>
                  <Plus className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Words</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(
                        articles.reduce(
                          (acc, a) => acc + a.content.split(" ").length,
                          0,
                        ) / articles.length,
                      )}
                    </p>
                  </div>
                  <Edit className="h-8 w-8 text-purple-600" />
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
                      placeholder="Search articles, authors, or content..."
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Published</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                    <SelectItem value="author">Author A-Z</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Articles Table */}
          <Card>
            <CardHeader>
              <CardTitle>Articles ({filteredArticles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentArticles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="font-medium truncate">
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
                              [View]
                            </a>
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {article.excerpt}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{article.author.name}</TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(article.category)}>
                          {article.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(article.status)}>
                          {article.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {article.publishedAt
                          ? formatDate(article.publishedAt)
                          : "Not published"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(article.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedArticle(article);
                                setViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Article
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditArticle(article)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Article
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteArticle(article.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Article
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredArticles.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-semibold mb-2">No articles found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm ||
                    categoryFilter !== "all" ||
                    statusFilter !== "all"
                      ? "No articles match your current filters."
                      : "Start by creating your first article."}
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex flex-col items-center space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {paginatedData.startIndex + 1} to{" "}
                    {Math.min(paginatedData.endIndex, filteredArticles.length)}{" "}
                    of {filteredArticles.length} articles
                  </div>
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
                        {selectedArticle.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        by {selectedArticle.author.name}
                      </span>
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

                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">
                      {selectedArticle.content}
                    </p>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEditArticle(selectedArticle)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Article
                    </Button>
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

          {/* Edit Article Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Edit Article</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editForm.category}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Politics">Politics</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Entertainment">
                        Entertainment
                      </SelectItem>
                      <SelectItem value="Health">Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-excerpt">Excerpt</Label>
                  <Textarea
                    id="edit-excerpt"
                    value={editForm.excerpt}
                    onChange={(e) =>
                      setEditForm({ ...editForm, excerpt: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-content">Content</Label>
                  <Textarea
                    id="edit-content"
                    value={editForm.content}
                    onChange={(e) =>
                      setEditForm({ ...editForm, content: e.target.value })
                    }
                    rows={10}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit}>Save Changes</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};
