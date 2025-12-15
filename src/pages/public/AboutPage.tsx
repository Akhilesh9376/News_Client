import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, MapPin, Shield, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
export const AboutPage = () => {
  const pageTitle = "About Us ┃ UP Uday News"
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicHeader />
      <Helmet>
      <title>{pageTitle}</title>
              <meta name="description" content={"Carrier News Latest news from UP Uday News"} />
            </Helmet>
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-brand-50 dark:bg-brand-950 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="inline-flex items-center space-x-2 rounded-lg bg-brand-600 px-3 py-2 text-white mb-4">
                <Newspaper className="h-4 w-4" />
                <span className="text-xs font-semibold">UP Uday News</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                Serving Uttar Pradesh since 1998
              </h1>
              <p className="mt-4 text-muted-foreground text-lg">
                UP Uday News brings you the latest, most trusted updates across all districts of Uttar Pradesh — from politics and policy to culture, sports, and daily life.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/">
                  <Button variant="default" className="bg-brand-600 hover:bg-brand-700">
                    Explore Latest News
                  </Button>
                </Link>
                <a href="mailto:editor@upudaynews.com">
                  <Button variant="outline">Contact Editorial</Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Legacy</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Established in 1998, UP Uday News has grown with the state, reporting pivotal moments and everyday stories that matter.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Coverage</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    District-by-district coverage across Uttar Pradesh: politics, education, health, business, culture, and sports.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Trust</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Accuracy, integrity, and accountability guide our newsroom. Your trust is our mandate.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Our Story</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      From humble beginnings in 1998, UP Uday News became a reliable source for residents across the state. We strive to bring timely, verified, and balanced reporting that informs communities and empowers citizens.
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                      <li>• 25+ years of continuous publishing</li>
                      <li>• 24/7 updates on critical developments</li>
                      <li>• Stories from all 75 districts</li>
                      <li>• Diverse coverage: policy, education, culture, sports</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>By the Numbers</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-brand-50 p-4 text-center">
                        <div className="text-2xl font-bold text-brand-700">25+</div>
                        <div className="text-xs text-muted-foreground">Years</div>
                      </div>
                      <div className="rounded-lg bg-brand-50 p-4 text-center">
                        <div className="text-2xl font-bold text-brand-700">75</div>
                        <div className="text-xs text-muted-foreground">Districts</div>
                      </div>
                      <div className="rounded-lg bg-brand-50 p-4 text-center">
                        <div className="text-2xl font-bold text-brand-700">24/7</div>
                        <div className="text-xs text-muted-foreground">Updates</div>
                      </div>
                      <div className="rounded-lg bg-brand-50 p-4 text-center">
                        <div className="text-2xl font-bold text-brand-700">1M+</div>
                        <div className="text-xs text-muted-foreground">Monthly Readers</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 p-8 md:p-12 text-white">
              <h2 className="text-2xl md:text-3xl font-bold">Have a story from Uttar Pradesh?</h2>
              <p className="mt-2 text-brand-100">
                Share your tip with our editorial team. Together, we keep the state informed.
              </p>
              <div className="mt-6 flex gap-3">
                <a href="mailto:tips@upudaynews.com">
                  <Button variant="secondary">Email your tip</Button>
                </a>
                <Link to="/">
                  <Button variant="default" className="text-white border-white hover:bg-white hover:text-brand-700">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default AboutPage;