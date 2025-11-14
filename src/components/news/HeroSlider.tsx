import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Article } from "@/types";

interface HeroSliderProps {
  articles: Article[];
}

export const HeroSlider = ({ articles }: HeroSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying || articles.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % articles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [articles.length, isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % articles.length);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      technology:
        "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800",
      sports:
        "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800",
      politics:
        "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800",
      business:
        "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800",
      entertainment:
        "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:hover:bg-purple-800",
      health:
        "bg-pink-100 text-pink-800 hover:bg-pink-200 dark:bg-pink-900 dark:text-pink-300 dark:hover:bg-pink-800",
    };
    return (
      colors[category.toLowerCase() as keyof typeof colors] ||
      "bg-gray-100 text-gray-800"
    );
  };

  if (articles.length === 0) {
    return (
      <div className="bg-gradient-to-r from-brand-50 to-brand-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-brand-300 flex items-center justify-center">
            <User className="w-8 h-8 text-brand-600" />
          </div>
          <h3 className="text-lg font-semibold text-brand-700">
            No featured articles available
          </h3>
          <p className="text-brand-600">Check back later for breaking news!</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-r from-brand-50 to-brand-100 py-12 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative max-w-6xl mx-auto">
          {/* Main Slider */}
          <div
            className="relative h-96 md:h-[500px] rounded-xl overflow-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {articles.map((article, index) => (
              <div
                key={article.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide
                    ? "opacity-100 pointer-events-auto z-10"
                    : "opacity-0 pointer-events-none z-0"
                }`}
                aria-hidden={index !== currentSlide}
              >
                <Card className="h-full overflow-hidden border-0 shadow-2xl">
                  <div className="relative h-full">
                    {/* Background Image or Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-200 via-brand-300 to-brand-400 flex items-center justify-center">
                      {article.imageUrl ? (
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-brand-600">
                          <div className="w-24 h-24 mx-auto mb-4 rounded-lg bg-brand-500/20 dark:bg-brand-400/20 flex items-center justify-center">
                            <User className="w-12 h-12 text-brand-600 dark:text-brand-400" />
                          </div>
                          <p className="text-lg font-medium">Featured Story</p>
                        </div>
                      )}
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
                      <CardContent className="p-8 text-white w-full">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Badge
                              className={`${getCategoryColor(
                                article.category,
                              )} border-0`}
                            >
                              {article.category}
                            </Badge>
                            <span className="text-sm text-white/80">
                              by {article.author.name}
                            </span>
                          </div>
                          <Link
                            to={`/article/${article.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <h1 className="text-3xl md:text-4xl font-bold leading-tight line-clamp-2 hover:text-brand-200 transition-colors cursor-pointer">
                              {article.title}
                            </h1>
                          </Link>
                          <p className="text-lg text-white/90 line-clamp-2 max-w-3xl">
                            {article.excerpt}
                          </p>
                          <Link
                            to={`/article/${article.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="secondary"
                              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300"
                            >
                              Read Full Story
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              </div>
            ))}

            {/* Navigation Arrows */}
            {articles.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300 rounded-full w-12 h-12 p-0"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300 rounded-full w-12 h-12 p-0"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}
          </div>

          {/* Dots Indicator */}
          {articles.length > 1 && (
            <div className="flex justify-center space-x-2 mt-6">
              {articles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-brand-600 scale-125"
                      : "bg-brand-300 hover:bg-brand-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Elements for Visual Interest */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-brand-200/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-brand-300/20 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-brand-400/20 rounded-full blur-lg"></div>
    </section>
  );
};
