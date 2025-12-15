import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSpeechSynthesis } from "react-speech-kit";
import {
  ArrowLeft,
  Calendar,
  User,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  Share2,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useAppSelector } from "@/hooks/redux";
import { useToast } from "@/hooks/use-toast";
import { Article } from "@/types";
import axiosInstance from "@/config/axiosInstance";
import { preventCopy } from "@/hooks/preventCopy";
import { Helmet } from "react-helmet-async";
export const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { articles } = useAppSelector((state) => state.news);
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Speech synthesis setup
  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis();

  const [speechSettings, setSpeechSettings] = useState({
    rate: 1,
    pitch: 1,
    volume: 0.8,
    voice: null as SpeechSynthesisVoice | null,
  });
  const [related, setRelated] = useState<Article[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedError, setRelatedError] = useState<string | null>(null);
  // call hook prevent copy
  preventCopy();
  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        // Try local cache first for faster render
        const cached = articles.find((a) => a.id === id);
        if (cached) {
          setArticle(cached);
        }
        // Always fetch latest by ID from API
        const res = await axiosInstance.get(`/news/${id}`);
        const n = res.data;
        const apiArticle: Article = {
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
          views: typeof n.views === "number" ? n.views : 0,
        };
        setArticle(apiArticle);

        // Increment views count (public endpoint)
        try {
          const incRes = await axiosInstance.post(`/news/${id}/view`);
          const newViews = incRes.data?.views;
          if (typeof newViews === "number") {
            setArticle((prev) => (prev ? { ...prev, views: newViews } : prev));
          }
        } catch (e) {
          // Non-blocking: ignore failures to increment views
          console.warn("Failed to increment views", e);
        }
      } catch (error) {
        console.error("Failed to load article by ID", error);
        setArticle(null);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchArticle();
  }, [id, articles]);

  useEffect(() => {
    // Set default voice (preferably English)
    if (voices.length > 0 && !speechSettings.voice) {
      const lower = (s: string) => s.toLowerCase();
      const hindiVoice =
        voices.find(
          (voice) =>
            lower(voice.lang).includes("hi") || lower(voice.name).includes("hindi"),
        ) || null;

      const englishVoice =
        voices.find(
          (voice) =>
            lower(voice.lang).includes("en") &&
            (voice.name.includes("Google") || voice.name.includes("Microsoft")),
        ) || voices[0];

      setSpeechSettings((prev) => ({ ...prev, voice: hindiVoice || englishVoice }));
    }
  }, [voices, speechSettings.voice]);

  // Extract plain text from the rendered article content for accessible read-aloud
  const handleSpeak = () => {
    if (!article) return;

    // Prefer grabbing only the visible content text to avoid styles/labels
    const contentEl = document.getElementById("article-content");
    const contentText = contentEl?.innerText?.trim();

    // Fallback: strip HTML tags from API content if DOM not available
    const stripTags = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

    const bodyText = contentText || stripTags(article.content);
    const textToSpeak = [article.title, bodyText].filter(Boolean).join(". ");

    speak({
      text: textToSpeak,
      voice: speechSettings.voice,
      rate: speechSettings.rate,
      pitch: speechSettings.pitch,
      volume: speechSettings.volume,
    });
  };

  // Load related articles by category when article is ready
  useEffect(() => {
    const loadRelated = async () => {
      if (!article?.category) {
        setRelated([]);
        return;
      }
      setRelatedLoading(true);
      setRelatedError(null);
      try {
        const category = encodeURIComponent(article.category);
        const res = await axiosInstance.get(`/news/category/${category}?limit=3`);
        const list = Array.isArray(res.data?.news) ? res.data.news : [];
        const mapped: Article[] = list
          .filter((n: any) => n._id !== article.id)
          .map((n: any) => ({
            id: n._id,
            title: n.heading,
            content: n.content,
            excerpt: n.subheading || "",
            imageUrl: n.imageUrl || "",
            category: n.category,
            author: { id: "unknown", name: n.employeeName || "Unknown" },
            status: "approved",
            createdAt: n.publishedDate ? new Date(n.publishedDate).toISOString() : new Date().toISOString(),
            updatedAt: n.publishedDate ? new Date(n.publishedDate).toISOString() : new Date().toISOString(),
            publishedAt: n.publishedDate ? new Date(n.publishedDate).toISOString() : undefined,
            views: typeof n.views === "number" ? n.views : 0,
          }));
        setRelated(mapped);
      } catch (e: any) {
        console.warn("Failed to load related articles", e);
        setRelatedError("Unable to load related articles");
        // Fallback to client cache (case-insensitive match)
        const cacheRelated = articles
          .filter(
            (a) =>
              a.id !== article.id &&
              a.status === "approved" &&
              a.category?.toLowerCase() === article.category?.toLowerCase(),
          )
          .sort(
            (a, b) =>
              new Date(b.publishedAt || b.createdAt).getTime() -
              new Date(a.publishedAt || a.createdAt).getTime(),
          )
          .slice(0, 3);
        setRelated(cacheRelated);
      } finally {
        setRelatedLoading(false);
      }
    };
    loadRelated();
  }, [article?.category, article?.id]);

  const handleStop = () => {
    cancel();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
        toast({
          title: "Article Shared! 📤",
          description: "The article has been shared successfully.",
          variant: "default",
        });
      } catch (error) {
        // User cancelled share or error occurred
        if (error.name !== "AbortError") {
          // Fallback to copying URL
          try {
            await navigator.clipboard.writeText(window.location.href);
            toast({
              title: "Link Copied! 📋",
              description: "Article URL has been copied to your clipboard.",
              variant: "default",
            });
          } catch (clipboardError) {
            toast({
              title: "Share Failed ❌",
              description: "Unable to share or copy the article link.",
              variant: "destructive",
            });
          }
        }
      }
    } else {
      // Fallback for browsers without Web Share API
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied! 📋",
          description: "Article URL has been copied to your clipboard.",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Copy Failed ❌",
          description: "Unable to copy the article link to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PublicHeader />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PublicHeader />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <Card>
              <CardContent className="p-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-red-100 flex items-center justify-center">
                  <span className="text-2xl">📰</span>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Article Not Found
                </h1>
                <p className="text-muted-foreground mb-6">
                  The article you're looking for doesn't exist or has been
                  removed.
                </p>
                <Link to="/">
                  <Button>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Homepage
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const estimatedReadTime = Math.ceil(article.content.split(" ").length / 200);
  const pageTitle = article
    ? `${article.title} | UP Uday News`
    : "Article | UP Uday News";

  return (

    <div className="min-h-screen flex flex-col bg-background">
      <PublicHeader />
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={article?.excerpt || "Latest news from UP Uday News"} />
      </Helmet>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Navigation */}
            <div className="mb-6">
              <Link
                to="/"
                className="inline-flex items-center text-muted-foreground hover:text-brand-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                Back to News
              </Link>
            </div>

            {/* Article Header */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center space-x-3 flex-wrap">
                <Badge className={getCategoryColor(article.category)}>
                  {article.category}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" aria-hidden="true" />
                  {formatDate(article.publishedAt || article.createdAt)}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
                  {estimatedReadTime} min read
                </div>
              </div>

              <h1 id="article-title" className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                {article.title}
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                {article.excerpt}
              </p>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center" aria-hidden="true">
                    <User className="h-5 w-5 text-brand-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {article.author.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Journalist at UP Uday News
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={handleShare} aria-label="Share this article">
                    <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {article.imageUrl && (
              <div className="mb-8">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <Card>
                  <CardContent className="p-8" role="article" aria-labelledby="article-title">
                    <div className="prose prose-lg max-w-none">
                      {/* <div
                        id="article-content"
                        className="text-foreground leading-relaxed"
                        aria-live="off"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                      /> */}
                      <div
                        id="article-content"
                        className="text-foreground leading-relaxed no-copy relative"
                        aria-live="off"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                      />

                    </div>
                    <div className="pointer-events-none select-none fixed inset-0 flex items-center justify-center">
                      <p
                        className="text-foreground/10 text-4xl font-semibold rotate-[-30deg]"
                        aria-hidden="true"
                      >
                        UP Uday News • Read Only
                      </p>
                    </div>

                  </CardContent>
                </Card>
              </div>

              {/* AI Audio Controls Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  {/* Audio Controls */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Volume2 className="h-5 w-5 text-brand-600" aria-hidden="true" />
                          <h3 className="font-semibold text-foreground">
                            AI Audio Reader
                          </h3>
                        </div>

                        {!supported ? (
                          <div className="text-sm text-muted-foreground">
                            <VolumeX className="h-4 w-4 inline mr-2" aria-hidden="true" />
                            Speech synthesis not supported in this browser
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {/* Play/Pause Controls */}
                            <div className="flex space-x-2">
                              <Button
                                onClick={speaking ? handleStop : handleSpeak}
                                className="flex-1"
                                disabled={!article}
                                aria-label={speaking ? "Stop reading the article" : "Read the article content aloud"}
                              >
                                {speaking ? (
                                  <>
                                    <Pause className="h-4 w-4 mr-2" aria-hidden="true" />
                                    Stop Reading
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4 mr-2" aria-hidden="true" />
                                    Read Article
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={handleStop}
                                disabled={!speaking}
                                aria-label="Stop reading"
                              >
                                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                              </Button>
                            </div>

                            {/* Voice Selection */}
                            <div>
                              <label className="text-sm font-medium text-foreground">
                                Voice
                              </label>
                              <select
                                value={speechSettings.voice?.name || ""}
                                onChange={(e) => {
                                  const selectedVoice = voices.find(
                                    (v) => v.name === e.target.value,
                                  );
                                  setSpeechSettings((prev) => ({
                                    ...prev,
                                    voice: selectedVoice || null,
                                  }));
                                }}
                                className="w-full mt-1 p-2 border border-border rounded-md text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 focus:ring-offset-background transition-colors"
                              >
                                {/* Prefer Hindi (India) voices, include English as well */}
                                {voices
                                  .filter(
                                    (voice) =>
                                      voice.lang.toLowerCase().includes("hi") ||
                                      voice.name.toLowerCase().includes("hindi") ||
                                      voice.lang.toLowerCase().includes("en"),
                                  )
                                  .map((voice) => (
                                    <option key={voice.name} value={voice.name}>
                                      {voice.name} ({voice.lang})
                                    </option>
                                  ))}
                              </select>
                              {/* Note: Hindi voice availability depends on the browser/OS. */}
                              {!voices.some(
                                (v) =>
                                  v.lang.toLowerCase().includes("hi") ||
                                  v.name.toLowerCase().includes("hindi"),
                              ) && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Hindi voice not detected. Try Chrome on Windows/macOS for broader voice support.
                                  </p>
                                )}
                            </div>

                            {/* Speed Control */}
                            <div>
                              <label className="text-sm font-medium text-foreground">
                                Speed: {speechSettings.rate.toFixed(1)}x
                              </label>
                              <Slider
                                value={[speechSettings.rate]}
                                onValueChange={(value) =>
                                  setSpeechSettings((prev) => ({
                                    ...prev,
                                    rate: value[0],
                                  }))
                                }
                                min={0.5}
                                max={2}
                                step={0.1}
                                className="mt-2"
                              />
                            </div>

                            {/* Volume Control */}
                            <div>
                              <label className="text-sm font-medium text-foreground">
                                Volume:{" "}
                                {Math.round(speechSettings.volume * 100)}%
                              </label>
                              <Slider
                                value={[speechSettings.volume]}
                                onValueChange={(value) =>
                                  setSpeechSettings((prev) => ({
                                    ...prev,
                                    volume: value[0],
                                  }))
                                }
                                min={0}
                                max={1}
                                step={0.1}
                                className="mt-2"
                              />
                            </div>

                            {speaking && (
                              <div className="text-sm text-brand-600 flex items-center">
                                <div className="animate-pulse mr-2">🔊</div>
                                Reading article...
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Article Stats */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-foreground mb-4">
                        Article Info
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Words:</span>
                          <span className="font-medium">
                            {article.content.split(" ").length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Read time:
                          </span>
                          <span className="font-medium">
                            {estimatedReadTime} min
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Category:
                          </span>
                          <span className="font-medium">
                            {article.category}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Published:
                          </span>
                          <span className="font-medium">
                            {new Date(
                              article.publishedAt || article.createdAt,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Related Articles */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-foreground mb-4">
                        Related Articles
                      </h3>
                      <div className="space-y-3">
                        {relatedLoading && (
                          <div className="text-sm text-muted-foreground">Loading related articles…</div>
                        )}
                        {!relatedLoading && related.length === 0 && (
                          <div className="text-sm text-muted-foreground">No related articles found in this category.</div>
                        )}
                        {!relatedLoading && related.length > 0 &&
                          related.map((relatedArticle) => (
                            <Link
                              key={relatedArticle.id}
                              to={`/article/${relatedArticle.id}`}
                              className="block p-3 rounded-lg hover:bg-accent transition-colors"
                            >
                              <h4 className="text-sm font-medium text-foreground line-clamp-2">
                                {relatedArticle.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {relatedArticle.author.name}
                              </p>
                            </Link>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
