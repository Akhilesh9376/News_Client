import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Newspaper, ArrowLeft, Save, Send, Eye, Type } from "lucide-react";
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
import { useAppSelector } from "@/hooks/redux";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/config/axiosInstance";
import { Article } from "@/types";

export const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const { toast } = useToast();

  const locationArticle = (location.state as { article?: Article })?.article;

  const [formData, setFormData] = useState({
    title: locationArticle?.title || "",
    excerpt: locationArticle?.excerpt || "",
    content: locationArticle?.content || "",
    category: locationArticle?.category || "",
    imageUrl: locationArticle?.imageUrl || "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "saving">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchArticle = async () => {
      if (locationArticle || !id) return;
      try {
        setStatus("loading");
        const res = await axiosInstance.get(`/news/${id}`);
        const n = res.data;
        setFormData({
          title: n.heading || "",
          excerpt: n.subheading || "",
          content: n.content || "",
          category: n.category || "",
          imageUrl: n.imageUrl || "",
        });
      } catch (error) {
        console.error("Failed to load article", error);
        toast({
          title: "Failed to load",
          description: "Could not fetch the article for editing.",
          variant: "destructive",
        });
      } finally {
        setStatus("idle");
      }
    };
    fetchArticle();
  }, [id, locationArticle, toast]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.title.trim()) e.title = "Title is required";
    if (!formData.excerpt.trim()) e.excerpt = "Excerpt is required";
    if (!formData.content.trim()) e.content = "Content is required";
    if (!formData.category.trim()) e.category = "Category is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    if (!id) return;
    if (!validate()) return;
    try {
      setStatus("saving");
      await axiosInstance.put(`/news/${id}`, {
        heading: formData.title,
        subheading: formData.excerpt,
        content: formData.content,
        category: formData.category,
        imageUrl: formData.imageUrl,
      });
      toast({
        title: "Updated",
        description: "Your article changes have been saved.",
        variant: "success",
      });
      navigate("/employee/my-articles");
    } catch (error) {
      console.error("Update failed", error);
      toast({
        title: "Update failed",
        description: "Could not save changes. Try again later.",
        variant: "destructive",
      });
    } finally {
      setStatus("idle");
    }
  };

  const handlePreview = () => {
    // Minimal preview via alert to keep scope tight
    alert("Preview:\n\n" + formData.title + "\n\n" + formData.excerpt);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/employee/dashboard" className="flex items-center space-x-2">
              <div className="bg-brand-600 p-2 rounded-lg">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
              <div>
  <h1 className="text-xl font-bold text-brand-700">UP Uday News</h1>
                <p className="text-xs text-brand-500 -mt-1">Employee Portal</p>
              </div>
            </Link>

            <div className="flex items-center space-x-2">
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
              <Link to="/employee/my-articles" className="text-muted-foreground hover:text-brand-600 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h1 className="text-3xl font-bold text-foreground">Edit Article</h1>
            </div>
            <p className="text-muted-foreground">Update your article details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title & Excerpt */}
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
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter headline"
                        className={errors.title ? "border-red-500" : ""}
                      />
                      {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                    </div>

                    <div>
                      <Label htmlFor="excerpt">Excerpt *</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        placeholder="Brief summary of your article"
                        rows={3}
                        className={errors.excerpt ? "border-red-500" : ""}
                      />
                      {errors.excerpt && <p className="text-sm text-red-600 mt-1">{errors.excerpt}</p>}
                      <p className="text-sm text-muted-foreground mt-1">{formData.excerpt.length}/200 characters</p>
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
                          onChange={(value) => setFormData({ ...formData, content: value })}
                          placeholder="Write your article..."
                          className={errors.content ? "border-red-500" : ""}
                        />
                      </div>
                      {errors.content && <p className="text-sm text-red-600 mt-1">{errors.content}</p>}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Category & Image */}
                <Card>
                  <CardHeader>
                    <CardTitle>Metadata</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Sports">Sports</SelectItem>
                          <SelectItem value="Politics">Politics</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
                          <SelectItem value="Health">Health</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
                    </div>

                    <div>
                      <Label htmlFor="imageUrl">Featured Image URL</Label>
                      <Input
                        id="imageUrl"
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700" disabled={status === "saving"}>
                        {status === "saving" ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => navigate(-1)} className="w-full">
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};