import { useState } from "react";
import { Menu, ArrowLeft } from "lucide-react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features?: string[];
}

export const PlaceholderPage = ({
  title,
  description,
  icon,
  features = [],
}: PlaceholderPageProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-background shadow-sm border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                {icon}
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {title}
                  </h1>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {icon}
                <span>{title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-brand-100 flex items-center justify-center">
                  {icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {description} This feature is currently under development and
                  will be available in a future update.
                </p>
              </div>

              {features.length > 0 && (
                <div className="space-y-3 text-left bg-brand-50 p-4 rounded-lg">
                  <h4 className="font-medium text-brand-700">
                    Planned Features:
                  </h4>
                  <ul className="text-sm text-brand-600 space-y-1">
                    {features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                variant="outline"
                className="mt-6"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};
