import { formatDistanceToNow } from "date-fns";
import { Calendar, User, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ArticlePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  articleData: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    imageUrl?: string;
  };
  authorName: string;
}

export const ArticlePreview = ({
  isOpen,
  onClose,
  articleData,
  authorName,
}: ArticlePreviewProps) => {
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

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const estimatedReadTime = Math.ceil(
    stripHtml(articleData.content).split(" ").length / 200,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Article Preview</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Article Header */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 flex-wrap">
              <Badge className={getCategoryColor(articleData.category)}>
                {articleData.category}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{estimatedReadTime} min read</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {articleData.title || "Untitled Article"}
            </h1>

            {articleData.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed">
                {articleData.excerpt}
              </p>
            )}

            <div className="flex items-center space-x-3 pt-4 border-t">
              <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-brand-600" />
              </div>
              <div>
                <p className="font-medium text-foreground">{authorName}</p>
                <p className="text-sm text-muted-foreground">
            Journalist at UP Uday News
                </p>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {articleData.imageUrl && (
            <div>
              <img
                src={articleData.imageUrl}
                alt={articleData.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          {/* Article Content */}
          <Card>
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                {articleData.content ? (
                  <div
                    className="text-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: articleData.content }}
                  />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Start writing your article content...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preview Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">ℹ</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Preview Mode</h4>
                <p className="text-sm text-blue-700 mt-1">
                  This is how your article will appear to readers once
                  published. Make any necessary changes before submitting for
                  review.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Continue Editing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
