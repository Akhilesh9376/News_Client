import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <FileText className="h-10 w-10 mx-auto text-brand-600" />
          <h1 className="mt-3 text-3xl md:text-4xl font-bold text-brand-800">Terms of Service</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Please read these terms carefully. By using UP Uday News, you agree to the terms outlined below.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Use of Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Content on this website is for informational purposes. Redistribution or commercial use requires prior written consent.</p>
              <p>We reserve the right to update or remove content without notice.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Conduct</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>You agree not to misuse the site, including attempts to breach security, spam, or upload harmful content.</p>
              <p>Comments and submissions should be respectful and lawful.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disclaimers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>UP Uday News provides content “as is” and makes no warranties regarding completeness or accuracy.</p>
              <p>We are not liable for indirect or consequential damages arising from site use.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact & Changes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>For questions about these terms, contact <span className="font-medium">legal@upudaynews.com</span>.</p>
              <p>These terms may be updated periodically. Continued use indicates acceptance of changes.</p>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center">
            Effective: {new Date().toLocaleDateString()}
          </p>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};

export default TermsPage;