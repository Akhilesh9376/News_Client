import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Newspaper,
  ArrowLeft,
  Save,
  Send,
  Eye,
  ImagePlus,
  FileText,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ArticlePreview } from "@/components/news/ArticlePreview";
import { EditorGuide } from "@/components/ui/editor-guide";
import { useAppSelector } from "@/hooks/redux";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/config/axiosInstance";

export const WriteArticle = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    imageUrl: "",
  });
  const [status, setStatus] = useState<"draft" | "submitting" | "submitted">(
    "draft",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewOpen, setPreviewOpen] = useState(false);

  // Helper function to strip HTML tags for validation and word count
  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const contentText = stripHtml(formData.content);

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 10) {
      newErrors.title = "Title must be at least 10 characters";
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = "Excerpt is required";
    } else if (formData.excerpt.length < 20) {
      newErrors.excerpt = "Excerpt must be at least 20 characters";
    }

    if (!contentText.trim()) {
      newErrors.content = "Content is required";
    } else if (contentText.length < 100) {
      newErrors.content = "Content must be at least 100 characters";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    if (!formData.title.trim()) {
      setErrors({ title: "Title is required to save draft" });
      toast({
        title: "Cannot Save Draft ⚠️",
        description: "Please add a title before saving your draft.",
        variant: "destructive",
      });
      return;
    }

    // Simulate saving draft
    setStatus("draft");
    // In real app, this would save to backend
    console.log("Draft saved:", formData);

    toast({
      title: "Draft Saved! 💾",
      description:
        "Your article has been saved as a draft. You can continue editing it later.",
      variant: "success",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Please Complete Required Fields ⚠️",
        description: "Check the form for any missing or invalid information.",
        variant: "destructive",
      });
      return;
    }

    // setStatus("submitting");

    //  calling the external API to submit the article
    try {
      const article = await axiosInstance.post("news",{
        heading: formData.title,
        subheading: formData.excerpt,
        content: formData.content,
        category: formData.category,
        imageUrl: formData.imageUrl,
      })
      console.log("User is ", user);
      const articleData =await article; 

      if(articleData.status === 200) {
        toast({
          title: "Article Submitted Successfully! 🎉",
          description:
            "Your article has been submitted for review. You'll be notified once it's been approved.",
          variant: "success",
        });
        setStatus("submitted"); 
      }

    } catch (error) {
      toast({
        title: "Submission Failed ❌",
        description:
          "There was an error submitting your article. Please try again later.",
        variant: "destructive",
      });
    }

    // Simulate submission
    // setTimeout(() => {
    //   setStatus("submitted");
    //   // In real app, this would submit to backend
    //   console.log("Article submitted:", {
    //     ...formData,
    //     author: user,
    //     status: "pending",
    //     createdAt: new Date().toISOString(),
    //   });

    //   toast({
    //     title: "Article Submitted Successfully! 🎉",
    //     description:
    //       "Your article has been submitted for review. You'll be notified once it's been approved.",
    //     variant: "default",
    //   });

    //   setTimeout(() => {
    //     navigate("/employee/my-articles");
    //   }, 2000);
    // }, 1000);
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const contentText = stripHtml(formData.content);
  const wordCount = contentText.split(/\s+/).filter(Boolean).length;
  const charCount = contentText.length;

  if (status === "submitted") {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-background shadow-sm border-b border-border">
          <div className="container mx-auto px-4 py-4">
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
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-green-100 flex items-center justify-center">
                <Send className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Article Submitted Successfully!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your article has been submitted for review. You'll be notified
                once it's been approved or if changes are needed.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate("/employee/my-articles")}
                  className="w-full"
                >
                  View My Articles
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/employee/dashboard")}
                  className="w-full"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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
              <EditorGuide />
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Link
                to="/employee/dashboard"
                className="text-muted-foreground hover:text-brand-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h1 className="text-3xl font-bold text-foreground">
                Write New Article
              </h1>
            </div>
            <p className="text-muted-foreground">
  Create engaging content for UP Uday News readers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title */}
                <Card>
                  <CardHeader>
                    <CardTitle>Article Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Article Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Enter a compelling headline..."
                        className={errors.title ? "border-red-500" : ""}
                      />
                      {errors.title && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="excerpt">Excerpt *</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) =>
                          setFormData({ ...formData, excerpt: e.target.value })
                        }
                        placeholder="Brief summary of your article..."
                        rows={3}
                        className={errors.excerpt ? "border-red-500" : ""}
                      />
                      {errors.excerpt && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.excerpt}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.excerpt.length}/200 characters
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Content */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Type className="h-5 w-5" />
                      <span>Article Content</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="content">Content *</Label>
                      <div className="mt-2">
                        <RichTextEditor
                          value={formData.content}
                          onChange={(value) =>
                            setFormData({ ...formData, content: value })
                          }
                          placeholder="Write your article content here... Use the toolbar above to format your text with headings, bold, italic, links, and more."
                          className={errors.content ? "border-red-500" : ""}
                        />
                      </div>
                      {errors.content && (
                        <p className="text-sm text-red-600 mt-2">
                          {errors.content}
                        </p>
                      )}
                      <div className="flex justify-between text-sm text-muted-foreground mt-3 pt-3 border-t">
                        <span>{wordCount} words</span>
                        <span>{charCount} characters</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Publishing Options */}
                <Card>
                  <CardHeader>
                    <CardTitle>Publishing Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger
                          className={errors.category ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select category" />
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
                          <SelectItem value="Environment">Environment</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="imageUrl">Featured Image URL</Label>
                      <Input
                        id="imageUrl"
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, imageUrl: e.target.value })
                        }
                        placeholder="https://example.com/image.jpg"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Optional: Add a featured image for your article
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Article Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Article Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Status:</span>
                        <Badge variant="secondary">
                          {status === "draft" ? "Draft" : "Submitting..."}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Author:</span>
                        <span className="text-sm">{user?.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Word Count:</span>
                        <span className="text-sm">{wordCount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Actions */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <Button
                        type="submit"
                        className="w-full bg-brand-600 hover:bg-brand-700"
                        disabled={status === "submitting"}
                      >
                        {status === "submitting" ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Submit for Review
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSaveDraft}
                        className="w-full"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save as Draft
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Writing Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle>Writing Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>
                        • Use <strong>H1, H2, H3</strong> headings to structure
                        your article
                      </li>
                      <li>
                        • Write compelling excerpts that summarize the story
                      </li>
                      <li>
                        • Use <em>bold</em> and <em>italic</em> text for
                        emphasis
                      </li>
                      <li>• Add quotes using the blockquote tool</li>
                      <li>• Include relevant links and references</li>
                      <li>• Use bullet points for lists and key information</li>
                      <li>• Add images to enhance your story</li>
                      <li>• Proofread before submitting</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>

        {/* Article Preview Modal */}
        <ArticlePreview
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          articleData={formData}
          authorName={user?.name || "Unknown Author"}
        />
      </main>
    </div>
  );
};
