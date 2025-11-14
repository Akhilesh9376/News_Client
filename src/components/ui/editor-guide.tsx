import { useState } from "react";
import { HelpCircle, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const EditorGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const guideSections = [
    {
      id: "formatting",
      title: "Text Formatting",
      content: [
        "Use **Bold** to emphasize important points",
        "Use *Italic* for quotes or emphasis",
        "Use ~~Strikethrough~~ for corrections",
        "Use `Code` for technical terms or code snippets",
      ],
    },
    {
      id: "headers",
      title: "Headers & Structure",
      content: [
        "H1: Main article title (use sparingly)",
        "H2: Major sections of your article",
        "H3: Subsections within major sections",
        "H4-H6: For detailed hierarchical content",
      ],
    },
    {
      id: "lists",
      title: "Lists & Organization",
      content: [
        "• Bullet points for general lists",
        "1. Numbered lists for ordered information",
        "Use lists to break up long paragraphs",
        "Keep list items concise and parallel",
      ],
    },
    {
      id: "media",
      title: "Links & Media",
      content: [
        "Add links to reference sources",
        "Include relevant images to enhance your story",
        "Use the image button to add photos",
        "Always add alt text for accessibility",
      ],
    },
    {
      id: "quotes",
      title: "Quotes & Citations",
      content: [
        "> Use blockquotes for important quotes",
        "Attribute quotes to their sources",
        "Use quotes to support your narrative",
        "Keep quotes concise and relevant",
      ],
    },
    {
      id: "tips",
      title: "Professional Writing Tips",
      content: [
        "Start with a compelling headline",
        "Write a clear, informative lead paragraph",
        "Use the inverted pyramid structure",
        "Include quotes from relevant sources",
        "End with a strong conclusion or call to action",
      ],
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <HelpCircle className="h-4 w-4 mr-2" />
          Writing Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5" />
            <span>Rich Text Editor Guide</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
            <p className="text-sm text-brand-700">
        <strong>Welcome to the UP Uday News Article Editor!</strong> This
              guide will help you create professional, engaging news articles
              using our rich text editor.
            </p>
          </div>

          {guideSections.map((section) => (
            <Card key={section.id}>
              <CardHeader className="pb-3">
                <CardTitle
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection(section.id)}
                >
                  <span className="text-lg">{section.title}</span>
                  {expandedSection === section.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
              {expandedSection === section.id && (
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {section.content.map((item, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              )}
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle>Keyboard Shortcuts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Formatting:</strong>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    <li>Ctrl/Cmd + B - Bold</li>
                    <li>Ctrl/Cmd + I - Italic</li>
                    <li>Ctrl/Cmd + U - Underline</li>
                    <li>Ctrl/Cmd + K - Add Link</li>
                  </ul>
                </div>
                <div>
                  <strong>Structure:</strong>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    <li>Ctrl/Cmd + 1-6 - Headers</li>
                    <li>Ctrl/Cmd + Shift + 7 - Bullet List</li>
                    <li>Ctrl/Cmd + Shift + 8 - Number List</li>
                    <li>Ctrl/Cmd + Shift + 9 - Quote</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">
              Ready to Start Writing?
            </h4>
            <p className="text-sm text-green-700">
              Remember: Great journalism tells a story. Use these tools to help
              your readers understand and engage with your content. Don't forget
              to preview your article before submitting!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
