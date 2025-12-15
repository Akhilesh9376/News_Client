import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { Helmet } from "react-helmet-async";

const PrivacyPage = () => {
  const pageTitle = "Privacy Page ┃ Up Uday News "
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={"Privacy Page from UP Uday News"} />
      </Helmet>
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <Shield className="h-10 w-10 mx-auto text-brand-600" />
          <h1 className="mt-3 text-3xl md:text-4xl font-bold text-brand-800">Privacy Policy</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Your privacy matters. This policy explains what we collect, why we collect it, and how we protect your information.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>We may collect personal information such as name, email, and usage data when you interact with UP Uday News.</p>
              <p>We use cookies and analytics to improve site performance and content relevance.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>We use data to personalize content, improve user experience, and maintain platform security.</p>
              <p>We do not sell your personal data. Limited sharing occurs only with trusted service providers to operate our services.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>You can opt out of certain analytics and update cookie preferences in your browser settings.</p>
              <p>To request data deletion or access, contact <span className="font-medium">privacy@upudaynews.com</span>.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>We follow industry-standard practices to protect your information against unauthorized access, alteration, disclosure, or destruction.</p>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center">
            Last updated: {new Date().toLocaleDateString()}. This policy may change as we improve our services.
          </p>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};

export default PrivacyPage;