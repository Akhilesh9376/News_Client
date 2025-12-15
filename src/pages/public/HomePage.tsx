import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { HeroSlider } from "@/components/news/HeroSlider";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { setArticles, appendArticles, setLoading, setError } from "@/store/slices/newsSlice";
// import { Skeleton } from "@/components/ui/skeleton";
import { Article } from "@/types";
import axiosInstance from "@/config/axiosInstance";
import { ArticleCard } from "@/components/news/ArticleCard";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Atom } from 'react-loading-indicators';
import { Helmet } from "react-helmet-async";


export const HomePage = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { articles, isLoading, filters } = useAppSelector(
    (state) => state.news,
  );
  // const [fetchedArticle,setFetchedArticle] = useState<Article[]>([]);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  // Small colorful animated circle loader
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <div className="relative w-16 h-16 animate-spin" aria-label="Loading">
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(red,orange,yellow,green,cyan,blue,purple,red)]"></div>
        <div className="absolute inset-2 rounded-full bg-background"></div>
      </div>
    </div>
  );

  // Load articles for a given page: always fetch 10 items and replace list
  useEffect(() => {
    const loadPage = async (pageToLoad: number) => {
      dispatch(setLoading(true));
      const maxRetries = 2;
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const res = await axiosInstance.get("/news", {
            params: { page: pageToLoad, limit: 10 },
          });
          const apiArticles = (res.data?.news || []).map((n: any) => ({
            id: n._id,
            title: n.heading,
            content: n.content,
            excerpt: n.subheading || "",
            imageUrl: n.imageUrl || "",
            category: n.category,
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
          }));
          const tp = res.data?.totalPages || 1;
          setTotalPages(tp);
          setHasMore(pageToLoad < tp && apiArticles.length > 0);
          // Replace list for each page (exactly 10 per page)
          dispatch(setArticles(apiArticles));
          break;
        } catch (error) {
          console.error("Failed to fetch articles", error);
          if (attempt < maxRetries) {
            await new Promise((r) => setTimeout(r, 600));
            continue;
          }
          dispatch(setError("Failed to load articles"));
        } finally {
          // isLoading handled in slice reducers
        }
      }
    };

    loadPage(page);
  }, [dispatch, page]);

  const filteredArticles = useMemo(() => {
    let filtered = articles.filter((article) => article.status === "approved");

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(
        (article) =>
          article.category.toLowerCase() === filters.category.toLowerCase(),
      );
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchLower) ||
          article.excerpt.toLowerCase().includes(searchLower) ||
          article.content.toLowerCase().includes(searchLower),
      );
    }

    // Sort latest-first (publishedAt or createdAt)
    return filtered.sort((a, b) => {
      const ad = new Date(a.publishedAt || a.createdAt).getTime();
      const bd = new Date(b.publishedAt || b.createdAt).getTime();
      return bd - ad;
    });
  }, [articles, filters]);

  useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => setFadeIn(true), 50);
      return () => clearTimeout(t);
    } else {
      setFadeIn(false);
    }
  }, [isLoading]);

  // Get featured articles for slider (top 4)
  const featuredArticles = filteredArticles.slice(0, 4);
  // Get remaining articles for the main list (start from 5th article)
  const regularArticles = filteredArticles.slice(4);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PublicHeader />
        <main className="flex-1 flex items-center justify-center">
          {/* <LoadingSpinner /> */}
          <Atom
            color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
            size="large"
            text="Loading..."
          />
        </main>

        <PublicFooter />
      </div>
    );
  }
  const pageTitle = "Home ┇ Up Uday News"
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicHeader />
      <Helmet>
         <title>{pageTitle}</title>
        <meta name="description" content={"Home Page from UP Uday News"} />
      </Helmet>
      <main className="flex-1">
        <div className={`transition-opacity duration-700 ease-out ${fadeIn ? "opacity-100" : "opacity-0"}`}>
          {/* Hero Slider Section */}
          <HeroSlider articles={featuredArticles} />

          {/* News Grid */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Articles */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        Latest News
                      </h2>
                      {regularArticles.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {regularArticles.length} more articles
                          {filters.category && ` in ${filters.category}`}
                        </p>
                      )}
                    </div>
                    {filters.category && (
                      <span className="text-sm text-muted-foreground">
                        Filtered by: {filters.category}
                      </span>
                    )}
                  </div>

                  {/* Regular articles: exactly 6 per page (plus 4 featured above) */}
                  <div className="space-y-4">
                    {regularArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>

                  {/* Bottom pagination: manual load next set */}
                  {totalPages > 1 && (
                    <div className="mt-6">
                      <Pagination>
                        <PaginationContent className="flex items-center gap-4">
                          {/* Show Back button on pages > 1 */}
                          {page > 1 && (
                            <PaginationItem>
                              <Button
                                variant="outline"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="transition-transform duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
                              >
                                Back
                              </Button>
                            </PaginationItem>
                          )}
                          <PaginationItem>
                            <span className="text-sm text-muted-foreground">
                              Page {page} of {totalPages}
                            </span>
                          </PaginationItem>
                          {/* Show Next button when there are more pages */}
                          {page < totalPages && (
                            <PaginationItem>
                              <Button
                                onClick={() => setPage((p) => p + 1)}
                                className="transition-transform duration-200 hover:scale-105 active:scale-95 hover:shadow-lg bg-gradient-to-r from-brand-500 to-brand-600 text-white"
                              >
                                Next
                              </Button>
                            </PaginationItem>
                          )}
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Trending */}
                  <div className="bg-card rounded-lg p-6 border">
                    <h3 className="font-semibold text-foreground mb-4">
                      🔥 Trending
                    </h3>
                    <div className="space-y-3">
                      {filteredArticles.slice(0, 3).map((article, index) => (
                        <Link
                          key={article.id}
                          to={`/article/${article.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start space-x-3 hover:bg-accent/50 p-2 rounded-lg transition-colors"
                        >
                          <div className="bg-brand-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-foreground leading-tight line-clamp-2 hover:text-brand-600 transition-colors">
                              {article.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {article.author.name}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-lg p-6 text-white">
                    <h3 className="font-semibold mb-4">📊 Today's Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Articles Published</span>
                        <span className="font-bold">
                          {filteredArticles.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Categories</span>
                        <span className="font-bold">6</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Writers</span>
                        <span className="font-bold">12</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};
