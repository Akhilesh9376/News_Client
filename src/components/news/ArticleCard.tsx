import { formatDistanceToNow } from "date-fns";
import { Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export const ArticleCard = ({
  article,
  featured = false,
}: ArticleCardProps) => {
  const categoryColors: Record<string, string> = {
    politics:
      "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800",
    technology:
      "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800",
    sports:
      "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800",
    business:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800",
    entertainment:
      "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:hover:bg-purple-800",
    health:
      "bg-pink-100 text-pink-800 hover:bg-pink-200 dark:bg-pink-900 dark:text-pink-300 dark:hover:bg-pink-800",
  };

  const timeAgo = formatDistanceToNow(
    new Date(article.publishedAt || article.createdAt),
    {
      addSuffix: true,
    },
  );

  if (featured) {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative">
          <div className="aspect-[16/9] bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-800 dark:to-brand-900 flex items-center justify-center">
            {article.imageUrl ? (
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-brand-400 text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-brand-300 dark:bg-brand-700 flex items-center justify-center">
                  <User className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                </div>
                <p className="text-sm">No image available</p>
              </div>
            )}
          </div>
          <Badge
            className={`absolute top-4 left-4 ${
              categoryColors[article.category.toLowerCase()] ||
              "bg-gray-100 text-gray-800"
            }`}
          >
            {article.category}
          </Badge>
        </div>
        <CardContent className="p-6">
          <Link
            to={`/article/${article.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="text-2xl font-bold text-foreground mb-3 leading-tight hover:text-brand-600 transition-colors cursor-pointer">
              {article.title}
            </h2>
          </Link>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{article.author.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex">
        <div className="w-32 h-24 bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-800 dark:to-brand-900 flex items-center justify-center flex-shrink-0">
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-brand-400 dark:text-brand-600" />
          )}
        </div>
        <CardContent className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <Badge
              className={`${
                categoryColors[article.category.toLowerCase()] ||
                "bg-gray-100 text-gray-800"
              } text-xs`}
            >
              {article.category}
            </Badge>
          </div>
          <Link
            to={`/article/${article.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3 className="font-semibold text-foreground mb-2 leading-tight line-clamp-2 hover:text-brand-600 transition-colors cursor-pointer">
              {article.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{article.author.name}</span>
            <span>{timeAgo}</span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
