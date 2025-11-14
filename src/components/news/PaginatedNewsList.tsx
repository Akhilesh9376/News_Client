import { ArticleCard } from "./ArticleCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { Article } from "@/types";

interface PaginatedNewsListProps {
  articles: Article[];
  itemsPerPage?: number;
}

export const PaginatedNewsList = ({
  articles,
  itemsPerPage = 6,
}: PaginatedNewsListProps) => {
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
    totalItems: articles.length,
    itemsPerPage,
  });

  const currentArticles = articles.slice(
    paginatedData.startIndex,
    paginatedData.endIndex,
  );

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-brand-100 flex items-center justify-center">
            <span className="text-2xl">📰</span>
          </div>
          <h3 className="text-lg font-semibold">No articles found</h3>
          <p className="text-sm">
            Check back later for new articles or adjust your filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Articles Grid */}
      <div className="space-y-6">
        {currentArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center space-y-4">
          {/* Page Info */}
          <div className="text-sm text-muted-foreground">
            Showing {paginatedData.startIndex + 1} to{" "}
            {Math.min(paginatedData.endIndex, articles.length)} of{" "}
            {articles.length} articles
          </div>

          {/* Pagination Controls */}
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

              {/* Page Numbers */}
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

              {/* Ellipsis for large page counts */}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

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
    </div>
  );
};
