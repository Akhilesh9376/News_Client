import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export const ContactPage = () => {
  const phone = "+91 98765 43210";
  const email = "contact@upudaynews.com";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero with animated media image (no page animations) */}
        <section className="bg-brand-50 dark:bg-brand-950 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              {/* Left: Text & actions */}
              <div className="max-w-3xl">
                <div className="inline-flex items-center space-x-2 rounded-lg bg-brand-600 px-3 py-2 text-white mb-4">
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  <span className="text-xs font-semibold">Get in Touch</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                  Contact UP Uday News
                </h1>
                <p className="mt-4 text-muted-foreground text-lg">
                  We’d love to hear from you. Reach out for tips, feedback, or general inquiries.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={`tel:${phone.replace(/\s/g, '')}`}>
                    <Button className="bg-brand-600 hover:bg-brand-700">
                      <Phone className="h-4 w-4 mr-2" aria-hidden="true" /> Call Us
                    </Button>
                  </a>
                  <a href={`mailto:${email}`}>
                    <Button variant="outline">
                      <Mail className="h-4 w-4 mr-2" aria-hidden="true" /> Email Us
                    </Button>
                  </a>
                </div>
              </div>

              {/* Right: Animated news-media illustration (inline SVG ticker) */}
              <div>
                <figure className="rounded-2xl border border-brand-600/20 bg-card p-4 shadow-lg">
                  <svg
                    viewBox="0 0 800 320"
                    className="w-full h-[260px]"
                    aria-hidden="true"
                    focusable="false"
                    role="presentation"
                  >
                    <defs>
                      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(20,20,30,0.95)" />
                        <stop offset="100%" stopColor="rgba(40,40,60,0.95)" />
                      </linearGradient>
                    </defs>

                    {/* Background */}
                    <rect x="0" y="0" width="800" height="320" fill="url(#bgGrad)" rx="16" />

                    {/* Subtle grid */}
                    <g stroke="rgba(255,255,255,0.06)" strokeWidth="1">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <line key={`v-${i}`} x1={i * 50} y1={0} x2={i * 50} y2={320} />
                      ))}
                      {Array.from({ length: 8 }).map((_, i) => (
                        <line key={`h-${i}`} x1={0} y1={i * 40} x2={800} y2={i * 40} />
                      ))}
                    </g>

                    {/* Headline banner */}
                    <rect x="0" y="22" width="800" height="56" fill="rgba(99,102,241,0.15)" />
                    <text x="24" y="58" fill="rgba(255,255,255,0.9)" fontSize="24" fontWeight="700">Uday News • Uttar Pradesh</text>

                    {/* Ticker bar */}
                    <rect x="0" y="240" width="800" height="56" fill="rgba(220,38,38,0.9)" />
                    <clipPath id="tickerClip"><rect x="0" y="240" width="800" height="56" /></clipPath>
                    <g clipPath="url(#tickerClip)">
                      <text y="278" fill="white" fontSize="24" fontWeight="800">
                        <tspan>
                          <animate attributeName="x" values="800; -1600" dur="14s" repeatCount="indefinite" />
                          Breaking News • Trusted Regional Coverage • Latest Updates • Community Voices • Investigations • Culture • Sports • Weather •
                        </tspan>
                      </text>
                    </g>

                    {/* Side monitor elements */}
                    <g>
                      <rect x="560" y="96" width="208" height="120" rx="10" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.35)" />
                      <text x="576" y="128" fill="rgba(255,255,255,0.85)" fontSize="16" fontWeight="700">Contact Desk</text>
                      <text x="576" y="154" fill="rgba(255,255,255,0.70)" fontSize="14">Phone: +91 98765 43210</text>
                      <text x="576" y="178" fill="rgba(255,255,255,0.70)" fontSize="14">Email: contact@upudaynews.com</text>
                      <text x="576" y="202" fill="rgba(255,255,255,0.65)" fontSize="12">Mon–Sat: 9 AM–7 PM</text>
                    </g>

                    {/* Lower thirds */}
                    <rect x="24" y="100" width="480" height="40" rx="8" fill="rgba(99,102,241,0.18)" />
                    <text x="40" y="126" fill="rgba(255,255,255,0.88)" fontSize="18" fontWeight="600">We’d love to hear your tips and feedback</text>
                    <rect x="24" y="152" width="480" height="40" rx="8" fill="rgba(99,102,241,0.18)" />
                    <text x="40" y="178" fill="rgba(255,255,255,0.80)" fontSize="16">Reach us via phone or email — quick responses during support hours</text>
                  </svg>
                  
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Details */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                    <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                    <span>Phone</span>
                  </CardTitle>
                 </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{phone}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                    <span>Email</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{email}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                    <span>Office</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Lucknow, Uttar Pradesh</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Hours & CTA */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" aria-hidden="true" />
                      <span>Support Hours</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>Monday – Saturday: 9:00 AM – 7:00 PM</p>
                    <p>Sunday: Closed</p>
                    <p>For urgent tips, use the email link above.</p>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link to="/">
                      <Button variant="outline" className="w-full">Go to Home</Button>
                    </Link>
                    <Link to="/about">
                      <Button variant="outline" className="w-full">About UP Uday News</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default ContactPage;